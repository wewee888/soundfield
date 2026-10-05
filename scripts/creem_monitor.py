#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Creem & SOUNDTEST.PRO Automated Store Monitoring & Revenue Heartbeat Script
Based on official Creem Agent Specifications (creem.io/SKILL.md & creem.io/HEARTBEAT.md)

Monitors:
  1. Real-time Creem.io transactions (sales, renewals, refunds)
  2. Subscription lifecycle (active, past_due, canceled, expired)
  3. Customer acquisition and growth
  4. State persistence in ~/.creem/heartbeat-state.json for anomaly & change detection
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
from datetime import datetime

# Windows terminal UTF-8 support
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CREEM_STATE_DIR = os.path.expanduser(os.path.join('~', '.creem'))
CREEM_STATE_FILE = os.path.join(CREEM_STATE_DIR, 'heartbeat-state.json')

def ensure_state_dir():
    if not os.path.exists(CREEM_STATE_DIR):
        os.makedirs(CREEM_STATE_DIR, exist_ok=True)

def load_previous_state():
    ensure_state_dir()
    default_state = {
        "lastCheckAt": None,
        "lastTransactionId": None,
        "transactionCount": 0,
        "customerCount": 0,
        "subscriptions": {
            "active": 0,
            "trialing": 0,
            "past_due": 0,
            "paused": 0,
            "canceled": 0,
            "expired": 0,
            "scheduled_cancel": 0
        },
        "knownSubscriptions": {},
        "totalRevenueCents": 0
    }
    if not os.path.exists(CREEM_STATE_FILE):
        return default_state
    try:
        with open(CREEM_STATE_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Merge with defaults in case of missing keys
            for k, v in default_state.items():
                if k not in data:
                    data[k] = v
            return data
    except Exception as e:
        print(f"[Warning] Could not read previous state file: {e}. Starting fresh.")
        return default_state

def save_state(state):
    ensure_state_dir()
    try:
        with open(CREEM_STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Error] Failed to save state file: {e}")

def creem_api_request(endpoint, api_key, is_test=False):
    base_url = "https://test-api.creem.io" if is_test else "https://api.creem.io"
    url = f"{base_url}{endpoint}"
    req = urllib.request.Request(url, headers={
        "x-api-key": api_key,
        "Accept": "application/json",
        "User-Agent": "SoundtestPro-Agent-Monitor/1.0"
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode('utf-8')
            return json.loads(body)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {"error": f"HTTP {e.code}", "detail": err_body}
    except Exception as e:
        return {"error": str(e)}

def format_cents(cents, currency="USD"):
    return f"${cents / 100:.2f} {currency}"

def run_heartbeat(api_key=None):
    now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    prev_state = load_previous_state()

    print("=" * 65)
    print("📊 SOUNDTEST.PRO · Creem.io Store Revenue & Subscription Heartbeat")
    print(f"🕒 Timestamp: {now_iso}")
    print("=" * 65)

    # 1. Check for Creem API Key
    if not api_key:
        api_key = os.environ.get("CREEM_API_KEY", "").strip()

    if not api_key:
        # Check ~/.creem/config.json if CLI was configured
        cli_config_file = os.path.join(CREEM_STATE_DIR, "config.json")
        if os.path.exists(cli_config_file):
            try:
                with open(cli_config_file, 'r', encoding='utf-8') as cf:
                    cfg = json.load(cf)
                    api_key = cfg.get("api_key", "").strip()
            except Exception:
                pass

    if not api_key:
        print("\nℹ️  Notice: No CREEM_API_KEY provided in environment or ~/.creem/config.json.")
        print("   Showing local heartbeat status and simulation mode.")
        print("   To connect live Creem telemetry, set $env:CREEM_API_KEY='creem_...'")
        print("\n--- Current Local Monitor Baseline ---")
        print(f"• Last check: {prev_state.get('lastCheckAt') or 'Never (First run)'}")
        print(f"• Total tracked transactions: {prev_state.get('transactionCount', 0)}")
        print(f"• Active subscriptions: {prev_state.get('subscriptions', {}).get('active', 0)}")
        print(f"• Past due alerts: {prev_state.get('subscriptions', {}).get('past_due', 0)}")
        print(f"• Canceled subscriptions: {prev_state.get('subscriptions', {}).get('canceled', 0)}")
        
        # Update last check
        prev_state["lastCheckAt"] = now_iso
        save_state(prev_state)
        print("\n✅ Local baseline state initialized at ~/.creem/heartbeat-state.json")
        return

    is_test_mode = api_key.startswith("creem_test_")
    env_label = "SANDBOX / TEST MODE" if is_test_mode else "LIVE PRODUCTION"
    print(f"🔑 Environment: {env_label}")

    # 2. Fetch Recent Transactions
    print("\n🔍 Fetching latest transactions from Creem...")
    tx_resp = creem_api_request("/v1/transactions/search?limit=20", api_key, is_test=is_test_mode)
    
    new_transactions = []
    current_tx_count = prev_state.get("transactionCount", 0)
    last_tx_id = prev_state.get("lastTransactionId")
    total_rev_cents = prev_state.get("totalRevenueCents", 0)

    if isinstance(tx_resp, dict) and "error" in tx_resp:
        print(f"❌ Could not fetch transactions: {tx_resp['error']}")
    else:
        tx_list = tx_resp if isinstance(tx_resp, list) else tx_resp.get("data", tx_resp.get("items", []))
        if tx_list:
            newest_tx = tx_list[0]
            newest_id = newest_tx.get("id")

            if last_tx_id is None:
                # First run - baseline
                prev_state["lastTransactionId"] = newest_id
                prev_state["transactionCount"] = len(tx_list)
                print(f"• Established transaction baseline: {len(tx_list)} existing transaction(s).")
            elif newest_id != last_tx_id:
                for tx in tx_list:
                    if tx.get("id") == last_tx_id:
                        break
                    new_transactions.append(tx)
                prev_state["lastTransactionId"] = newest_id
                prev_state["transactionCount"] += len(new_transactions)

    # 3. Fetch Subscription Breakdown
    print("🔍 Fetching subscription metrics...")
    statuses = ["active", "trialing", "past_due", "canceled", "expired", "paused"]
    current_subs = {}
    known_subs = prev_state.get("knownSubscriptions", {})
    sub_changes = []

    for st in statuses:
        sub_resp = creem_api_request(f"/v1/subscriptions/search?status={st}", api_key, is_test=is_test_mode)
        if isinstance(sub_resp, list):
            items = sub_resp
        elif isinstance(sub_resp, dict):
            items = sub_resp.get("data", sub_resp.get("items", []))
        else:
            items = []
        current_subs[st] = len(items)

        # Detect individual status transitions
        for item in items:
            sub_id = item.get("id")
            if sub_id:
                prev_st = known_subs.get(sub_id)
                if prev_st and prev_st != st:
                    sub_changes.append({"id": sub_id, "from": prev_st, "to": st, "customer": item.get("customer", {}).get("email")})
                known_subs[sub_id] = st

    # 4. Fetch Customers
    cust_resp = creem_api_request("/v1/customers/list", api_key, is_test=is_test_mode)
    cust_list = cust_resp if isinstance(cust_resp, list) else cust_resp.get("data", [])
    current_cust_count = len(cust_list) if isinstance(cust_list, list) else prev_state.get("customerCount", 0)

    # 5. Print Findings & Highlights
    print("\n" + "=" * 65)
    print("📈 HEARTBEAT SUMMARY REPORT")
    print("=" * 65)

    if new_transactions:
        print(f"\n🎉 NEW SALES ALERT: {len(new_transactions)} new order(s) detected!")
        for tx in new_transactions:
            amt = tx.get("amount", 0)
            cur = tx.get("currency", "USD")
            cust = tx.get("customer", {}).get("email", "unknown")
            prod = tx.get("product", {}).get("name", "Pro License")
            print(f"  • +{format_cents(amt, cur)} | {prod} | Customer: {cust}")
            total_rev_cents += amt
    else:
        print("\n• Transactions: No new sales since last check.")

    if sub_changes:
        print("\n⚠️  SUBSCRIPTION LIFECYCLE ALERTS:")
        for sc in sub_changes:
            print(f"  • Subscription {sc['id']} ({sc.get('customer')}): Changed from [{sc['from']}] → [{sc['to']}]")
            if sc["to"] == "past_due":
                print("    🚨 ACTION REQUIRED: Payment collection failed. Creem is retrying.")
            elif sc["to"] == "canceled":
                print("    📉 CHURN ALERT: Customer canceled their subscription.")

    print(f"\n📋 Active Customer & Subscription Breakdown:")
    print(f"  • Total Customers:     {current_cust_count}")
    print(f"  • Active Subscribers:  {current_subs.get('active', 0)}")
    print(f"  • Past Due (At Risk):  {current_subs.get('past_due', 0)}")
    print(f"  • Canceled:            {current_subs.get('canceled', 0)}")
    print(f"  • Expired:             {current_subs.get('expired', 0)}")

    # 6. Save State
    prev_state["lastCheckAt"] = now_iso
    prev_state["customerCount"] = current_cust_count
    prev_state["subscriptions"] = current_subs
    prev_state["knownSubscriptions"] = known_subs
    prev_state["totalRevenueCents"] = total_rev_cents
    save_state(prev_state)

    print(f"\n💾 State saved to: {CREEM_STATE_FILE}")
    print("✅ Heartbeat check complete.")

if __name__ == "__main__":
    key = sys.argv[1] if len(sys.argv) > 1 else None
    run_heartbeat(key)

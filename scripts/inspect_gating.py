import os, re

def inspect_auth():
    print("=== INSPECTING assets/site-auth.js ===")
    with open('assets/site-auth.js', 'r', encoding='utf-8') as f:
        content = f.read()
    print("Length of site-auth.js:", len(content))
    # print function names
    funcs = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', content)
    print("Functions in site-auth.js:", funcs)
    
    # Check localStorage keys used
    keys = re.findall(r'localStorage\.(?:getItem|setItem|removeItem)\([\'"]([^\'"]+)[\'"]', content)
    print("localStorage keys in site-auth.js:", set(keys))

def inspect_plan_gating():
    print("\n=== INSPECTING FEATURE GATING IN soundtest.html ===")
    with open('soundtest.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Search for checks like currentPlan, isPro, membershipState, planConfig
    patterns = [
        r'currentPlan\s*===?\s*[\'"][^\'"]+[\'"]',
        r'membershipState\.active',
        r'membershipState\.plan',
        r'planConfig\(\)',
        r'canUse[a-zA-Z0-9_]+',
        r'isPro',
    ]
    for pat in patterns:
        matches = re.findall(pat, content)
        print(f"Pattern '{pat}': {len(matches)} occurrences")

if __name__ == '__main__':
    inspect_auth()
    inspect_plan_gating()

import os

cards_dir = r'assets/images/cards'
os.makedirs(cards_dir, exist_ok=True)

svg_construction_peaks = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_cpeak" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
    <linearGradient id="drill_grad" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#ffb858"/>
      <stop offset="0.5" stop-color="#ff6276"/>
      <stop offset="1" stop-color="#2cf0c1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_cpeak)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Time axis -->
  <line x1="30" y1="95" x2="370" y2="95" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <text x="30" y="112" fill="#8ca5d0" font-family="'JetBrains Mono',monospace" font-size="10">07:00 (Quiet)</text>
  <text x="180" y="112" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700">08:15 (Drilling 88dB)</text>
  <text x="315" y="112" fill="#8ca5d0" font-family="'JetBrains Mono',monospace" font-size="10">17:00 (Halt)</text>
  
  <!-- Baseline vs Spike Curve -->
  <path d="M30 90 L120 90 Q140 90 150 45 L160 30 L175 60 L190 25 L210 35 L225 90 L370 90" fill="none" stroke="url(#drill_grad)" stroke-width="3"/>
  <circle cx="190" cy="25" r="5" fill="#ff6276"/>
  <rect x="155" y="6" width="70" height="16" rx="8" fill="rgba(255,98,118,0.2)" stroke="#ff6276"/>
  <text x="190" y="18" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="9" font-weight="700" text-anchor="middle">PEAK 88.5 dB</text>
  
  <!-- Badges -->
  <rect x="30" y="122" width="105" height="18" rx="9" fill="rgba(255,184,88,0.12)"/>
  <text x="82" y="134" fill="#ffb858" font-family="-apple-system,sans-serif" font-size="9" font-weight="600" text-anchor="middle">🚧 Heavy Machinery</text>
  <rect x="145" y="122" width="105" height="18" rx="9" fill="rgba(44,240,193,0.12)"/>
  <text x="197" y="134" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="9" font-weight="600" text-anchor="middle">📍 GPS &amp; Timestamp</text>
</svg>'''

svg_rental_timeline = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_rent" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_rent)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Calendar / timeline cards -->
  <g transform="translate(30, 25)">
    <!-- Day 1 -->
    <rect width="95" height="65" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <text x="10" y="20" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">Mon · 23:30</text>
    <text x="10" y="42" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="15" font-weight="700">76.4 dB</text>
    <text x="10" y="56" fill="#ffb858" font-family="-apple-system,sans-serif" font-size="8">Loud Bass TV</text>
    
    <!-- Day 3 -->
    <rect x="110" width="95" height="65" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <text x="120" y="20" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">Wed · 01:15</text>
    <text x="120" y="42" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="15" font-weight="700">81.0 dB</text>
    <text x="120" y="56" fill="#ff6276" font-family="-apple-system,sans-serif" font-size="8">Party / Shouting</text>
    
    <!-- Day 5 -->
    <rect x="220" width="120" height="65" rx="8" fill="rgba(44,240,193,0.08)" stroke="rgba(44,240,193,0.3)"/>
    <text x="230" y="20" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="9" font-weight="700">EVIDENCE DOSSIER</text>
    <text x="230" y="40" fill="#fff" font-family="-apple-system,sans-serif" font-size="12" font-weight="700">Ready to Send</text>
    <text x="230" y="56" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="9">PDF Exported ✓</text>
  </g>
  
  <text x="30" y="125" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="11">Turn ambiguous lease complaints into an airtight, date-stamped paper trail.</text>
</svg>'''

svg_workplace_osha = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_osha" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_osha)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Gauge bar -->
  <rect x="30" y="45" width="340" height="14" rx="7" fill="rgba(255,255,255,0.08)"/>
  <rect x="30" y="45" width="170" height="14" rx="7" fill="#2cf0c1"/>
  <rect x="200" y="45" width="60" height="14" fill="#ffb858"/>
  <rect x="260" y="45" width="110" height="14" rx="0 7 7 0" fill="#ff6276"/>
  
  <!-- OSHA 85dB Marker line -->
  <line x1="260" y1="35" x2="260" y2="70" stroke="#fff" stroke-width="2"/>
  <text x="260" y="30" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="700" text-anchor="middle">OSHA 85 dBA ACTION LIMIT</text>
  
  <!-- Readings & Status -->
  <g transform="translate(30, 85)">
    <rect width="105" height="42" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <text x="12" y="18" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">FLOOR NOISE</text>
    <text x="12" y="34" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="13" font-weight="700">72.1 dBA</text>
    
    <rect x="115" width="115" height="42" rx="8" fill="rgba(255,98,118,0.1)" stroke="rgba(255,98,118,0.3)"/>
    <text x="127" y="18" fill="#ff6276" font-family="-apple-system,sans-serif" font-size="9">EQUIPMENT ROOM</text>
    <text x="127" y="34" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="13" font-weight="700">89.4 dBA ⚠️</text>
    
    <rect x="240" width="100" height="42" rx="8" fill="rgba(124,155,255,0.08)" stroke="rgba(124,155,255,0.2)"/>
    <text x="252" y="18" fill="#a8c4ff" font-family="-apple-system,sans-serif" font-size="9">PROTECTION</text>
    <text x="252" y="34" fill="#fff" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">Ear Muffs Req.</text>
  </g>
</svg>'''

svg_property_complaint = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_prop" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_prop)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Apartment unit grid -->
  <g transform="translate(30, 20)">
    <rect width="90" height="48" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)"/>
    <text x="12" y="20" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10">Unit 410 (Tenant)</text>
    <text x="12" y="38" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="12">38.5 dB (Quiet)</text>
    
    <rect x="105" width="130" height="48" rx="8" fill="rgba(255,98,118,0.12)" stroke="rgba(255,98,118,0.3)"/>
    <text x="117" y="20" fill="#ff6276" font-family="-apple-system,sans-serif" font-size="10" font-weight="700">Unit 412 (Source)</text>
    <text x="117" y="38" fill="#ff6276" font-family="'JetBrains Mono',monospace" font-size="12" font-weight="700">79.2 dB 🚨 Music</text>
    
    <rect x="250" width="90" height="48" rx="8" fill="rgba(44,240,193,0.08)" stroke="rgba(44,240,193,0.25)"/>
    <text x="262" y="20" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="10">STATUS</text>
    <text x="262" y="38" fill="#fff" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">Logged ✓</text>
  </g>
  
  <!-- Property Manager action bar -->
  <g transform="translate(30, 85)">
    <rect width="340" height="44" rx="8" fill="rgba(16,24,48,0.8)" stroke="rgba(124,155,255,0.2)"/>
    <text x="16" y="20" fill="#fff" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">Property Manager Incident Dossier #PR-2026-89</text>
    <text x="16" y="34" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">Exported report includes dB trends, room notes, timestamps &amp; tenant sign-off</text>
  </g>
</svg>'''

svg_acoustic_limits = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_limits" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_limits)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Left: Civilian Browser Tier -->
  <g transform="translate(20, 18)">
    <rect width="160" height="74" rx="8" fill="rgba(44,240,193,0.06)" stroke="rgba(44,240,193,0.25)"/>
    <circle cx="20" cy="22" r="10" fill="rgba(44,240,193,0.15)" stroke="#2cf0c1" stroke-width="1.2"/>
    <text x="20" y="26" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="11" font-weight="700" text-anchor="middle">📱</text>
    <text x="36" y="20" fill="#fff" font-family="-apple-system,sans-serif" font-size="11" font-weight="700">Civilian Evidence Aid</text>
    <text x="36" y="32" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">SOUNDTEST.PRO</text>
    
    <text x="12" y="52" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600">✓ Pattern &amp; Trend Logs</text>
    <text x="12" y="66" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">Mediation · Landlords · Diaries</text>
  </g>

  <!-- Divider arrow / boundary symbol -->
  <g transform="translate(186, 45)">
    <circle cx="14" cy="10" r="13" fill="rgba(255,184,88,0.12)" stroke="rgba(255,184,88,0.4)"/>
    <text x="14" y="14" fill="#ffb858" font-family="-apple-system,sans-serif" font-size="10" font-weight="700" text-anchor="middle">VS</text>
  </g>

  <!-- Right: Certified SLM Tier -->
  <g transform="translate(220, 18)">
    <rect width="160" height="74" rx="8" fill="rgba(255,184,88,0.06)" stroke="rgba(255,184,88,0.25)"/>
    <circle cx="20" cy="22" r="10" fill="rgba(255,184,88,0.15)" stroke="#ffb858" stroke-width="1.2"/>
    <text x="20" y="25" fill="#ffb858" font-family="-apple-system,sans-serif" font-size="11" font-weight="700" text-anchor="middle">⚖️</text>
    <text x="36" y="20" fill="#fff" font-family="-apple-system,sans-serif" font-size="11" font-weight="700">Class 1/2 Certified</text>
    <text x="36" y="32" fill="#ffb858" font-family="-apple-system,sans-serif" font-size="9">IEC 61672 Type Meter</text>
    
    <text x="12" y="52" fill="#ffb858" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600">✓ Court Litigation</text>
    <text x="12" y="66" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="9">Statutory Fines · Enforcement</text>
  </g>

  <!-- Bottom Notice Pill -->
  <g transform="translate(20, 102)">
    <rect width="360" height="32" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
    <text x="180" y="122" fill="#a8c4ff" font-family="-apple-system,sans-serif" font-size="10" font-weight="500" text-anchor="middle">⚠️ Boundary Notice: Field records establish behavior patterns, not certified legal proof.</text>
  </g>
</svg>'''

more_files = {
    'card_construction_peaks.svg': svg_construction_peaks,
    'card_rental_timeline.svg': svg_rental_timeline,
    'card_workplace_osha.svg': svg_workplace_osha,
    'card_property_complaint.svg': svg_property_complaint,
    'card_acoustic_limits.svg': svg_acoustic_limits,
}

for name, content in more_files.items():
    p = os.path.join(cards_dir, name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f'Wrote {p} ({os.path.getsize(p)} B)')


import os

cards_dir = r'assets/images/cards'
os.makedirs(cards_dir, exist_ok=True)

# 1. card_what_to_record.svg
svg_what_to_record = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_rec" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
    <linearGradient id="wave_grad" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#2cf0c1"/>
      <stop offset="0.5" stop-color="#7c9bff"/>
      <stop offset="1" stop-color="#ff6276"/>
    </linearGradient>
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_rec)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Apartment Ceiling & Wall Wireframe -->
  <path d="M30 35 L370 35" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="35" y="26" fill="#7c9bff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="600">UPSTAIRS / CEILING BOUNDARY</text>
  
  <!-- Impact Sound Ripples -->
  <circle cx="200" cy="35" r="8" fill="#ff6276" opacity="0.8"/>
  <circle cx="200" cy="35" r="22" stroke="#ff6276" stroke-width="1.5" opacity="0.6"/>
  <circle cx="200" cy="35" r="38" stroke="#ffb858" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.5"/>
  <circle cx="200" cy="35" r="56" stroke="#2cf0c1" stroke-width="1" opacity="0.3"/>
  
  <!-- Waveform spikes downstairs -->
  <path d="M40 105 Q70 105 85 90 T130 115 T170 80 T200 60 T230 85 T270 110 T310 95 T360 105" fill="none" stroke="url(#wave_grad)" stroke-width="2.5" filter="url(#glow1)"/>
  
  <!-- Context Pills -->
  <g transform="translate(30, 118)">
    <rect width="90" height="22" rx="11" fill="rgba(255,98,118,0.15)" stroke="rgba(255,98,118,0.3)"/>
    <text x="45" y="15" fill="#ff6276" font-family="-apple-system,sans-serif" font-size="10" font-weight="700" text-anchor="middle">PEAK 74.2 dB</text>
  </g>
  <g transform="translate(130, 118)">
    <rect width="110" height="22" rx="11" fill="rgba(124,155,255,0.12)" stroke="rgba(124,155,255,0.25)"/>
    <text x="55" y="15" fill="#a8c4ff" font-family="-apple-system,sans-serif" font-size="10" font-weight="600" text-anchor="middle">TIME 23:45:12</text>
  </g>
  <g transform="translate(250, 118)">
    <rect width="120" height="22" rx="11" fill="rgba(44,240,193,0.1)" stroke="rgba(44,240,193,0.25)"/>
    <text x="60" y="15" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="10" font-weight="600" text-anchor="middle">BEDROOM · CLOSED</text>
  </g>
</svg>'''

# 2. card_soundtest_engine.svg
svg_engine_features = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_eng" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
    <linearGradient id="bar_grad" x1="0" y1="1" x2="0" y2="0">
      <stop stop-color="#2cf0c1"/>
      <stop offset="0.7" stop-color="#7c9bff"/>
      <stop offset="1" stop-color="#ff90c2"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_eng)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Spectrum analyzer bars -->
  <g transform="translate(30, 20)">
    <!-- 20 Spectrum bars -->
    <rect x="0" y="70" width="8" height="25" rx="3" fill="url(#bar_grad)"/>
    <rect x="12" y="60" width="8" height="35" rx="3" fill="url(#bar_grad)"/>
    <rect x="24" y="48" width="8" height="47" rx="3" fill="url(#bar_grad)"/>
    <rect x="36" y="35" width="8" height="60" rx="3" fill="url(#bar_grad)"/>
    <rect x="48" y="20" width="8" height="75" rx="3" fill="url(#bar_grad)"/>
    <rect x="60" y="28" width="8" height="67" rx="3" fill="url(#bar_grad)"/>
    <rect x="72" y="15" width="8" height="80" rx="3" fill="url(#bar_grad)"/>
    <rect x="84" y="22" width="8" height="73" rx="3" fill="url(#bar_grad)"/>
    <rect x="96" y="40" width="8" height="55" rx="3" fill="url(#bar_grad)"/>
    <rect x="108" y="52" width="8" height="43" rx="3" fill="url(#bar_grad)"/>
    <rect x="120" y="38" width="8" height="57" rx="3" fill="url(#bar_grad)"/>
    <rect x="132" y="25" width="8" height="70" rx="3" fill="url(#bar_grad)"/>
    <rect x="144" y="32" width="8" height="63" rx="3" fill="url(#bar_grad)"/>
    <rect x="156" y="55" width="8" height="40" rx="3" fill="url(#bar_grad)"/>
    <rect x="168" y="65" width="8" height="30" rx="3" fill="url(#bar_grad)"/>
    <rect x="180" y="75" width="8" height="20" rx="3" fill="url(#bar_grad)"/>
  </g>
  
  <!-- Right Dashboard Box -->
  <g transform="translate(230, 20)">
    <rect width="140" height="108" rx="10" fill="rgba(16,24,46,0.8)" stroke="rgba(124,155,255,0.25)"/>
    <text x="14" y="24" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10" font-weight="600">WEIGHTING</text>
    <text x="14" y="42" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700">A / C / Z</text>
    
    <text x="14" y="64" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10" font-weight="600">EQUIVALENT</text>
    <text x="14" y="82" fill="#ffb858" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700">LAeq 68.4 dB</text>
    
    <text x="14" y="98" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="9">🔒 SHA-256 Hash</text>
  </g>
  
  <!-- Bottom legend -->
  <text x="30" y="136" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10">20Hz ── 1/3 OCTAVE SPECTRUM ── 20kHz</text>
</svg>'''

# 3. card_how_to_share.svg
svg_how_to_share = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" fill="none">
  <defs>
    <linearGradient id="bg_share" x1="0" y1="0" x2="400" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="400" height="150" rx="14" fill="url(#bg_share)"/>
  <rect x="0.5" y="0.5" width="399" height="149" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Document Sheet -->
  <g transform="translate(35, 18)">
    <rect width="90" height="114" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <line x1="12" y1="18" x2="60" y2="18" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="12" y1="28" x2="78" y2="28" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="12" y1="36" x2="72" y2="36" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Mini graph inside document -->
    <rect x="12" y="44" width="66" height="32" rx="3" fill="#e2e8f0"/>
    <path d="M16 68 Q28 50 38 62 T58 48 T74 65" fill="none" stroke="#2563eb" stroke-width="1.8"/>
    <!-- Stamp -->
    <circle cx="66" cy="94" r="12" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="2 2" fill="rgba(220,38,38,0.1)"/>
    <text x="66" y="97" fill="#dc2626" font-family="-apple-system,sans-serif" font-size="7" font-weight="700" text-anchor="middle">VERIFIED</text>
  </g>
  
  <!-- Flow arrow -->
  <path d="M145 75 L185 75 M175 67 L185 75 L175 83" stroke="#2cf0c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Recipient Badges on Right -->
  <g transform="translate(205, 22)">
    <rect width="165" height="30" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
    <text x="14" y="19" fill="#e2e8f0" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">🏢 Landlord / Property Mgr</text>
    
    <rect y="38" width="165" height="30" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
    <text x="14" y="57" fill="#e2e8f0" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">⚖️ Legal / Mediation Dossier</text>
    
    <rect y="76" width="165" height="30" rx="8" fill="rgba(44,240,193,0.08)" stroke="rgba(44,240,193,0.25)"/>
    <text x="14" y="95" fill="#2cf0c1" font-family="-apple-system,sans-serif" font-size="11" font-weight="600">📄 PDF / CSV / JSON Export</text>
  </g>
</svg>'''

# 4. card_three_habits.svg
svg_three_habits = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 130" fill="none">
  <defs>
    <linearGradient id="bg_habits" x1="0" y1="0" x2="500" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a1226"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
  </defs>
  <rect width="500" height="130" rx="14" fill="url(#bg_habits)"/>
  <rect x="0.5" y="0.5" width="499" height="129" rx="13.5" stroke="rgba(168,196,255,0.12)"/>
  
  <!-- Step 1 -->
  <g transform="translate(25, 25)">
    <circle cx="20" cy="20" r="18" fill="rgba(44,240,193,0.15)" stroke="#2cf0c1" stroke-width="1.5"/>
    <text x="20" y="25" fill="#2cf0c1" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700" text-anchor="middle">1</text>
    <text x="48" y="16" fill="#fff" font-family="-apple-system,sans-serif" font-size="12" font-weight="700">Multiple Sessions</text>
    <text x="48" y="32" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10">10-30 min over 7 days</text>
  </g>
  
  <!-- Connector 1 -->
  <line x1="175" y1="45" x2="195" y2="45" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="3 3"/>
  
  <!-- Step 2 -->
  <g transform="translate(205, 25)">
    <circle cx="20" cy="20" r="18" fill="rgba(124,155,255,0.15)" stroke="#7c9bff" stroke-width="1.5"/>
    <text x="20" y="25" fill="#7c9bff" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700" text-anchor="middle">2</text>
    <text x="48" y="16" fill="#fff" font-family="-apple-system,sans-serif" font-size="12" font-weight="700">Fixed Point</text>
    <text x="48" y="32" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10">Same room, note windows</text>
  </g>
  
  <!-- Connector 2 -->
  <line x1="340" y1="45" x2="360" y2="45" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="3 3"/>
  
  <!-- Step 3 -->
  <g transform="translate(370, 25)">
    <circle cx="20" cy="20" r="18" fill="rgba(255,184,88,0.15)" stroke="#ffb858" stroke-width="1.5"/>
    <text x="20" y="25" fill="#ffb858" font-family="'JetBrains Mono',monospace" font-size="14" font-weight="700" text-anchor="middle">3</text>
    <text x="48" y="16" fill="#fff" font-family="-apple-system,sans-serif" font-size="12" font-weight="700">Export &amp; Hash</text>
    <text x="48" y="32" fill="#8ca5d0" font-family="-apple-system,sans-serif" font-size="10">Save PDF with records</text>
  </g>
  
  <rect x="25" y="82" width="450" height="30" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)"/>
  <text x="250" y="101" fill="#a8c4ff" font-family="-apple-system,sans-serif" font-size="11" text-anchor="middle">💡 Defensible noise records require consistency, not just a one-off emotional clip.</text>
</svg>'''

files = {
    'card_what_to_record.svg': svg_what_to_record,
    'card_engine_features.svg': svg_engine_features,
    'card_how_to_share.svg': svg_how_to_share,
    'card_three_habits.svg': svg_three_habits,
}

for name, content in files.items():
    p = os.path.join(cards_dir, name)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f'Wrote {p} ({os.path.getsize(p)} B)')

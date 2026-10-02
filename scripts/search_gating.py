with open('soundtest.html', 'r', encoding='utf-8') as f:
    text = f.read()

keywords = ['membershipState', 'currentPlan', 'isPro', 'buildPDF', 'watermark', 'autoRec', 'recordingLimit', 'maxRec', 'template', 'license']

for kw in keywords:
    matches = [line.strip() for line in text.splitlines() if kw in line]
    print(f"=== Keyword: '{kw}' ({len(matches)} occurrences) ===")
    for m in matches[:5]:
        print("  ", m[:110])

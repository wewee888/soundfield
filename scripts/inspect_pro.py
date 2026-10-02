with open('soundtest.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'isProActive' in l or 'function buildPDF' in l or 'function normalizeMembership' in l:
        print(f"=== Line {i+1}: {l.strip()} ===")
        for j in range(max(0, i-5), min(len(lines), i+25)):
            print(f"  {j+1}: {lines[j].rstrip()}")

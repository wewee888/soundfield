import glob
import re

files = glob.glob('use-cases/**/*.html', recursive=True) + glob.glob('use-cases/*.html')
files = list(set(files))
count = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    orig = content

    # 1. Replace microphone_calibration_test.webp with cards/card_acoustic_limits.svg
    content = re.sub(
        r'src="([^"]*?)microphone_calibration_test\.webp"',
        r'src="\1cards/card_acoustic_limits.svg"',
        content
    )

    # 2. Add robust containment to card-media height: 130px containers
    content = re.sub(
        r'<div class="card-media" style="height: 130px;">',
        r'<div class="card-media" style="height: 130px; overflow: hidden; position: relative;">',
        content
    )

    # 3. Add robust styling to images inside card-media
    content = re.sub(
        r'(<div class="card-media"[^>]*>\s*<img [^>]*?)(style="[^"]*")?(\s*loading="lazy">)',
        lambda m: m.group(1).rstrip() + ' style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">',
        content
    )


    # 4. Cache-bust site.css -> site.css?v=8
    content = re.sub(
        r'href="([^"]*?assets/site\.css)(?:\?v=\d+)?"',
        r'href="\1?v=8"',
        content
    )

    if content != orig:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print('Updated:', f)
        count += 1

print('Total files updated:', count)


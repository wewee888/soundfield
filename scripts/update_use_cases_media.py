import os, glob, re

locales = ['zh', 'es', 'fr', 'de', 'ja', 'ko', 'th', 'vi']

img_configs = {
    'construction-noise-monitoring.html': {
        'img': '../../../assets/images/construction_noise_evidence.webp',
        'alt': 'Construction noise monitoring app on active site'
    },
    'rental-dispute-evidence.html': {
        'img': '../../../assets/images/rental_dispute_evidence.webp',
        'alt': 'Rental dispute noise evidence log and decibel report packet'
    },
    'property-noise-complaint-report.html': {
        'img': '../../../assets/images/property_noise_report.webp',
        'alt': 'Residential noise complaint investigation report audit'
    },
    'workplace-noise-inspection.html': {
        'img': '../../../assets/images/workplace_noise_inspection.webp',
        'alt': 'Workplace industrial noise exposure inspection audit'
    },
    'index.html': {
        'img': '../../../assets/images/noise_detection_visualization.webp',
        'alt': 'Specialized noise evidence templates and workflow'
    }
}

count_updated = 0

for loc in locales:
    loc_dir = os.path.join('use-cases', loc)
    if not os.path.isdir(loc_dir):
        continue

    # 1. Update neighbor-noise-evidence.html
    nn_path = os.path.join(loc_dir, 'neighbor-noise-evidence.html')
    if os.path.isfile(nn_path):
        with open(nn_path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content.replace(
            'hero_noise_monitor.png',
            'neighbor_noise_monitor.webp'
        ).replace(
            '../../../assets/noise_detection_assets/images_export/neighbor_noise_monitor.webp',
            '../../../assets/images/neighbor_noise_monitor.webp'
        )
        if new_content != content:
            with open(nn_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {nn_path} with webp')
            count_updated += 1

    # 2. Update bar-street-disturbance.html
    bs_path = os.path.join(loc_dir, 'bar-street-disturbance.html')
    if os.path.isfile(bs_path):
        with open(bs_path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content.replace(
            'hero_noise_scene.png',
            'bar_street_noise.webp'
        ).replace(
            '../../../assets/noise_detection_assets/images_export/bar_street_noise.webp',
            '../../../assets/images/bar_street_noise.webp'
        )
        if new_content != content:
            with open(bs_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {bs_path} with webp')
            count_updated += 1

    # 3. Add hero images to the others if not present
    for fname, conf in img_configs.items():
        fpath = os.path.join(loc_dir, fname)
        if not os.path.isfile(fpath):
            continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<div class="hero-image-wrapper"' in content:
            continue

        wrapper_html = f'''        <div class="hero-image-wrapper" style="margin-top: 2.5rem; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.05);">
          <img src="{conf['img']}" alt="{conf['alt']}" style="width: 100%; height: auto; display: block;" loading="lazy">
        </div>
      </div>
    </section>'''

        pattern = r'(<div class="hero-actions">.*?</div>\s*</div>\s*</section>)'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            old_block = match.group(1)
            actions_match = re.search(r'(<div class="hero-actions">.*?</div>)', old_block, re.DOTALL)
            if actions_match:
                actions_html = actions_match.group(1)
                replacement = f'{actions_html}\n{wrapper_html}'
                new_content = content.replace(old_block, replacement, 1)
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Added image to {fpath}')
                count_updated += 1

print(f'Total localized files updated: {count_updated}')

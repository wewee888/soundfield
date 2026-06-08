import json
import ast

with open("scripts/sync-locale-homepages.py", "r", encoding="utf-8") as f:
    text = f.read()

start = text.find('COPY = {')
lines = text[start:].split('\n')
valid_lines = []
for line in lines:
    valid_lines.append(line)
    if line.startswith('}'):
        break
copy_dict = ast.literal_eval('\n'.join(valid_lines)[7:])

zh_keys = [x[0] for x in copy_dict['zh']['replacements']]
missing_data = {}

for lang in ['es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']:
    lang_keys = [x[0] for x in copy_dict[lang].get('replacements', [])]
    missing = [k for k in zh_keys if k not in lang_keys]
    missing_data[lang] = missing

with open("scripts/missing.json", "w", encoding="utf-8") as f:
    json.dump(missing_data, f, indent=2, ensure_ascii=False)

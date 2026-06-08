import ast

with open("scripts/sync-locale-homepages.py", "r", encoding="utf-8") as f:
    text = f.read()

# find COPY dict
start = text.find('COPY = {')
if start == -1:
    print("Cannot find COPY")
    exit(1)

# try to parse COPY dict by reading lines
lines = text.split('\n')
copy_lines = []
in_copy = False
for line in lines:
    if line.startswith('COPY = {'):
        in_copy = True
    if in_copy:
        copy_lines.append(line)
    if in_copy and line == '}':
        break

copy_str = '\n'.join(copy_lines)
copy_str = copy_str[7:] # remove 'COPY = '
try:
    copy_dict = ast.literal_eval(copy_str)
    zh_reps = copy_dict.get('zh', {}).get('replacements', [])
    en_strings = [x[0] for x in zh_reps]
    print(f"Total English strings in zh: {len(en_strings)}")
except Exception as e:
    print(f"Eval error: {e}")


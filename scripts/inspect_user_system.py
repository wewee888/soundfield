import os, re

def main():
    files = []
    for root, dirs, files_in_dir in os.walk('.'):
        if '.git' in dirs: dirs.remove('.git')
        for f in files_in_dir:
            if f.endswith(('.html', '.js')):
                files.append(os.path.join(root, f))
    
    print(f"Total files: {len(files)}")
    for category in ['admin', 'auth', 'membership', 'stats', 'dashboard', 'user']:
        matching = [f for f in files if category in f.lower()]
        print(f"\n--- Category: {category} ({len(matching)}) ---")
        for m in matching[:10]:
            print(" ", m)

    # Let's inspect functions/ directory
    print("\n--- Functions directory ---")
    if os.path.exists('functions'):
        for r, d, fs in os.walk('functions'):
            for f in fs:
                print(" ", os.path.join(r, f))

if __name__ == '__main__':
    main()

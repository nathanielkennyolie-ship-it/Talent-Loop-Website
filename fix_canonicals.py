"""
Talent Loop - Canonical Tag Fix Script
Run this script in your local repository folder to fix all canonical tags.

Usage:
    python3 fix_canonicals.py

This script will:
1. Add canonical tags to pages missing them
2. Fix Twitter/X social links across all pages
3. Create backups of original files before modifying
"""

import re
import os
import shutil

# Map of filename -> correct canonical URL
CANONICALS = {
    "index.html":       "https://www.talent-loop.org/",
    "about.html":       "https://www.talent-loop.org/about.html",
    "assessment.html":  "https://www.talent-loop.org/assessment.html",
    "blog.html":        "https://www.talent-loop.org/blog.html",
    "blog_post_1.html": "https://www.talent-loop.org/blog_post_1.html",
    "blog_post_2.html": "https://www.talent-loop.org/blog_post_2.html",
    "blog_post_3.html": "https://www.talent-loop.org/blog_post_3.html",
    "blog_post_4.html": "https://www.talent-loop.org/blog_post_4.html",
    "blog_post_5.html": "https://www.talent-loop.org/blog_post_5.html",
    "blog_post_6.html": "https://www.talent-loop.org/blog_post_6.html",
    "contact.html":     "https://www.talent-loop.org/contact.html",
    "testimonials.html":"https://www.talent-loop.org/testimonials.html",
    "privacy.html":     "https://www.talent-loop.org/privacy.html",
    "legal.html":       "https://www.talent-loop.org/legal.html",
}

# Social link fixes
SOCIAL_FIXES = [
    (
        '<a href="#" aria-label="Twitter">𝕏</a>',
        '<a href="https://x.com/talent_loop/" aria-label="Twitter" target="_blank">𝕏</a>'
    ),
    (
        '<a href="#">TW</a>',
        '<a href="https://x.com/talent_loop/" target="_blank">TW</a>'
    ),
]

def fix_file(filename, canonical_url):
    """Fix a single HTML file - add canonical tag and fix social links"""
    
    if not os.path.exists(filename):
        print(f"  ⚠️  {filename} not found - skipping")
        return False
    
    # Read original content
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes = []
    
    # --- Fix 1: Canonical Tag ---
    if 'rel="canonical"' in content:
        # Update existing canonical
        new_content = re.sub(
            r'<link rel="canonical" href="[^"]*">',
            f'<link rel="canonical" href="{canonical_url}">',
            content
        )
        if new_content != content:
            content = new_content
            changes.append("Updated existing canonical tag")
    else:
        # Add canonical after viewport meta tag
        canonical_tag = f'\n    <link rel="canonical" href="{canonical_url}">'
        new_content = content.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            f'<meta name="viewport" content="width=device-width, initial-scale=1.0">{canonical_tag}'
        )
        if new_content != content:
            content = new_content
            changes.append(f"Added canonical tag: {canonical_url}")
        else:
            changes.append("⚠️  Could not find viewport meta tag to insert canonical")

    # --- Fix 2: Social Links ---
    for old_link, new_link in SOCIAL_FIXES:
        if old_link in content:
            content = content.replace(old_link, new_link)
            changes.append("Fixed Twitter/X link")

    # --- Write fixed file if changes were made ---
    if content != original_content:
        # Create backup
        backup_name = filename + '.backup'
        shutil.copy2(filename, backup_name)
        
        # Write fixed content
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ {filename}")
        for change in changes:
            print(f"     → {change}")
        return True
    else:
        print(f"  ℹ️  {filename} - no changes needed")
        return False


def main():
    print("=" * 60)
    print("Talent Loop - Canonical Tag & Social Link Fix Script")
    print("=" * 60)
    print()
    
    fixed_count = 0
    skipped_count = 0
    
    for filename, canonical_url in CANONICALS.items():
        result = fix_file(filename, canonical_url)
        if result:
            fixed_count += 1
        else:
            skipped_count += 1
    
    print()
    print("=" * 60)
    print(f"✅ Fixed:   {fixed_count} files")
    print(f"ℹ️  Skipped: {skipped_count} files")
    print()
    print("Next steps:")
    print("1. Commit all changed .html files to GitHub")
    print("2. Wait 2-3 minutes for Cloudflare to redeploy")
    print("3. Go to Google Search Console → Pages")
    print("4. Request indexing for all affected pages")
    print("=" * 60)


if __name__ == "__main__":
    main()

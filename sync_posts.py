import os
import glob
import markdown2
import frontmatter
from atlassian import Confluence

# --- CONFIGURATION ---
URL = 'https://cloudera.atlassian.net'
USERNAME = os.environ.get('CONFLUENCE_EMAIL')
PASSWORD = os.environ.get('CONFLUENCE_TOKEN')
SPACE_KEY = 'person'
PARENT_ID = '11962745157' 

# --- TEST SETTINGS ---
TEST_MODE = False
# IMPORTANT: Update this to point to the exact file you want to test
TEST_FILE = '_posts/2023-05-17-welcome.md' 

confluence = Confluence(url=URL, username=USERNAME, password=PASSWORD)

def sync_posts():
    if TEST_MODE:
        post_files = [TEST_FILE]
        print(f"🛠️ TEST MODE: Processing only {TEST_FILE}")
    else:
        # Look for markdown files in 'posts' or '_posts'
        post_files = glob.glob("posts/*.md") + glob.glob("_posts/*.md")
    
    if not post_files:
        print("No markdown files found. Check your folder names or TEST_FILE path.")
        return

    for file_path in post_files:
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            continue

        # Safely read file with UTF-8
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
        
        # Handle empty categories safely
        raw_categories = post.get('categories')
        if raw_categories is None:
            raw_categories = []
            
        # Standardize categories
        if isinstance(raw_categories, str):
            category_list = [raw_categories.upper()]
        else:
            category_list = [str(c).upper() for c in raw_categories]

        # In TEST_MODE, we bypass the category filter to ensure the test file runs
        if 'BLOG' not in category_list and not TEST_MODE:
            print(f"⏭️ Skipping {file_path}: 'BLOG' not in categories.")
            continue
        
        # Safe title extraction
        raw_title = post.get('title')
        if raw_title:
            title = str(raw_title)
        else:
            title = os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
        
        # Confluence APIs reject slashes in titles
        title = title.replace("/", "-").replace("\\", "-")
        
        # Convert Markdown to HTML
        html_body = markdown2.markdown(post.content, extras=["tables", "fenced-code-blocks", "break-on-newline"])

        # Prevent Confluence from rejecting completely empty bodies
        if not html_body or not html_body.strip():
            html_body = "<p><i>(Empty Post)</i></p>"

        print(f"Syncing: {title}...")

        try:
            # Upsert Logic
            if confluence.page_exists(space=SPACE_KEY, title=title):
                page_id = confluence.get_page_id(space=SPACE_KEY, title=title)
                confluence.update_page(
                    page_id=page_id,
                    title=title,
                    body=html_body,
                    parent_id=PARENT_ID,
                    type='page',
                    representation='storage'
                )
                print(f"✅ Updated: {title}")
            else:
                confluence.create_page(
                    space=SPACE_KEY,
                    title=title,
                    body=html_body,
                    parent_id=PARENT_ID,
                    type='page',
                    representation='storage'
                )
                print(f"✨ Created: {title}")
        except Exception as e:
            print(f"❌ Failed to sync {title}: {e}")

if __name__ == "__main__":
    sync_posts()
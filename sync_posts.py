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

# Set to True to only process the TEST_FILE
TEST_MODE = False 
TEST_FILE = 'posts/your-test-file.md' 

confluence = Confluence(url=URL, username=USERNAME, password=PASSWORD)

def sync_posts():
    if TEST_MODE:
        post_files = [TEST_FILE]
        print(f"🛠️ TEST MODE: Processing {TEST_FILE}")
    else:
        # Check both 'posts' and '_posts' just in case
        post_files = glob.glob("posts/*.md") + glob.glob("_posts/*.md")
    
    if not post_files:
        print("No markdown files found. Check your folder names.")
        return

    for file_path in post_files:
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            continue

        post = frontmatter.load(file_path)
        
        # Check categories
        raw_categories = post.get('categories', [])
        if isinstance(raw_categories, str):
            category_list = [raw_categories.upper()]
        else:
            category_list = [str(c).upper() for c in raw_categories]

        if 'BLOG' not in category_list and not TEST_MODE:
            print(f"⏭️ Skipping {file_path}: 'BLOG' not in {category_list}")
            continue
        
        title = post.get('title') or os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
        
        # Convert Markdown to HTML
        html_body = markdown2.markdown(post.content, extras=["tables", "fenced-code-blocks", "break-on-newline"])

        print(f"Syncing: {title}...")

        try:
            if confluence.page_exists(space=SPACE_KEY, title=title):
                page_id = confluence.get_page_id(space=SPACE_KEY, title=title)
                # Update existing page
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
                # Create brand new page
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
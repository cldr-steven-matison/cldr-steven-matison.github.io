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
# Set this to True to only process ONE specific file for testing
TEST_MODE = True 
TEST_FILE = 'posts/2023-05-17-welcome.md' # Replace with an actual file path in your repo

confluence = Confluence(url=URL, username=USERNAME, password=PASSWORD)

def sync_posts():
    # Determine which files to process
    if TEST_MODE:
        post_files = [TEST_FILE]
        print(f"🛠️ Running in TEST MODE. Processing only: {TEST_FILE}")
    else:
        post_files = glob.glob("posts/*.md")
    
    if not post_files:
        print("No markdown files found to process.")
        return

    for file_path in post_files:
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            continue

        # Load file and parse YAML Frontmatter
        post = frontmatter.load(file_path)
        
        # CATEGORY FILTER: Only take posts where category is 'BLOG'
        # This assumes your YAML has: category: BLOG
        category = post.get('category', '').upper()
        if category != 'BLOG' and not TEST_MODE:
            print(f"⏭️ Skipping {file_path}: Category is '{category}', not 'BLOG'")
            continue
        
        # Priority: 1. Title from YAML, 2. Filename
        title = post.get('title') or os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
        
        # Convert Markdown body to HTML
        html_body = markdown2.markdown(post.content, extras=["tables", "fenced-code-blocks", "break-on-newline"])

        print(f"Syncing: {title}...")

        try:
            if confluence.page_exists(SPACE_KEY, title):
                page_id = confluence.get_page_id(SPACE_KEY, title)
                confluence.update_page(
                    page_id=page_id,
                    title=title,
                    body=html_body,
                    parent_id=PARENT_ID,
                    type='page'
                )
                print(f"✅ Updated: {title}")
            else:
                confluence.create_page(
                    space=SPACE_KEY,
                    title=title,
                    body=html_body,
                    parent_id=PARENT_ID,
                    type='page'
                )
                print(f"✨ Created: {title}")
        except Exception as e:
            print(f"❌ Failed to sync {title}: {e}")

if __name__ == "__main__":
    sync_posts()
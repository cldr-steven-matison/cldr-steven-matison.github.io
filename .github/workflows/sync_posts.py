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
TEST_FILE = 'posts/my-test-post.md' # UPDATE THIS to an existing file path

confluence = Confluence(url=URL, username=USERNAME, password=PASSWORD)

def sync_posts():
    if TEST_MODE:
        post_files = [TEST_FILE]
        print(f"🛠️ TEST MODE: Processing only {TEST_FILE}")
    else:
        post_files = glob.glob("posts/*.md")
    
    if not post_files:
        print("No markdown files found.")
        return

    for file_path in post_files:
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            continue

        post = frontmatter.load(file_path)
        
        # CATEGORIES FILTER
        # Handles both strings 'BLOG' and lists ['BLOG', 'NEWS']
        raw_categories = post.get('categories', [])
        if isinstance(raw_categories, str):
            category_list = [raw_categories.upper()]
        else:
            category_list = [c.upper() for c in raw_categories]

        if 'BLOG' not in category_list and not TEST_MODE:
            print(f"⏭️ Skipping {file_path}: 'BLOG' not in {category_list}")
            continue
        
        title = post.get('title') or os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
        
        # Convert Markdown to HTML
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
                    parent_
import os
import glob
import re
import markdown2
import frontmatter
from atlassian import Confluence

# --- CONFIGURATION ---
URL = 'https://cloudera.atlassian.net'
USERNAME = os.environ.get('CONFLUENCE_EMAIL')
PASSWORD = os.environ.get('CONFLUENCE_TOKEN')
SPACE_KEY = 'person'
PARENT_ID = '11962745157' 
BLOG_BASE_URL = 'https://stevenmatison.com'

confluence = Confluence(url=URL, username=USERNAME, password=PASSWORD)

def fix_relative_links(match):
    """Prepends the base URL to relative markdown links."""
    path = match.group(1)
    if path.startswith(('http', 'mailto:', '#')):
        return f']({path})'
    
    if not path.startswith('/'):
        path = '/' + path
    return f']({BLOG_BASE_URL}{path})'

def fix_confluence_code_blocks(match):
    """Converts HTML code blocks to Confluence XML macros."""
    lang = match.group(1) or ""
    code_content = match.group(2)
    
    # Escape characters for Confluence CDATA
    code_content = code_content.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
    
    return f'''<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">{lang}</ac:parameter>
  <ac:parameter ac:name="theme">Confluence</ac:parameter>
  <ac:plain-text-body><![CDATA[{code_content}]]></ac:plain-text-body>
</ac:structured-macro>'''

def sync_posts():
    # Fetch all markdown files
    post_files = glob.glob("posts/*.md") + glob.glob("_posts/*.md")
    
    if not post_files:
        print("No markdown files found.")
        return

    for file_path in post_files:
        if not os.path.exists(file_path):
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
        
        # --- CATEGORY FILTER ---
        raw_categories = post.get('categories')
        if raw_categories is None:
            raw_categories = []
            
        if isinstance(raw_categories, str):
            category_list = [raw_categories.upper()]
        else:
            category_list = [str(c).upper() for c in raw_categories]

        if 'BLOG' not in category_list:
            print(f"⏭️ Skipping {file_path}: 'BLOG' not in categories.")
            continue
        
        # --- TITLE EXTRACTION ---
        raw_title = post.get('title')
        if raw_title:
            title = str(raw_title)
        else:
            title = os.path.basename(file_path).replace(".md", "").replace("-", " ").title()
        
        # Sanitize for Confluence
        title = title.replace("/", "-").replace("\\", "-")
        
        # --- CONTENT PRE-PROCESSING ---
        content = post.content
        
        # 1. Fix Liquid Variables
        content = content.replace('{{ page.title }}', title).replace('{{page.title}}', title)
        
        # 2. Fix Links
        content = re.sub(r'\]\((.*?)\)', fix_relative_links, content)
        
        # Convert to HTML
        html_body = markdown2.markdown(content, extras=["tables", "fenced-code-blocks", "break-on-newline"])

        # 3. Fix Code Blocks
        html_body = re.sub(r'<pre><code(?: class="language-(.*?)")?>(.*?)</code></pre>', fix_confluence_code_blocks, html_body, flags=re.DOTALL)

        if not html_body or not html_body.strip():
            html_body = "<p><i>(Empty Post)</i></p>"

        print(f"Syncing: {title}...")

        try:
            # --- THE UPSERT LOGIC ---
            if confluence.page_exists(space=SPACE_KEY, title=title):
                page_id = confluence.get_page_id(space=SPACE_KEY, title=title)
                # Update an existing page
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
                # Create a new page only if it doesn't exist
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
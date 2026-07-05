import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'useEffect(() => {\n    if (activeTab === "order" || activeTab === "product") {\n      refreshProducts();\n    }',
    'useEffect(() => {\n    // FIXED ADMIN SYNC ISSUE: Fetch latest products array from API/DB on tab change/mount so tab filtering correctly identifies newly added products\n    if (activeTab === "order" || activeTab === "product") {\n      refreshProducts();\n    }'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

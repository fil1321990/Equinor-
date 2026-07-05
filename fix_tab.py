import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<span className="capitalize">{tab === "vip" ? "VIP" : tab}</span>',
    '<span className="capitalize">{tab}</span>'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

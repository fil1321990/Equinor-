import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('<title>Equinor ASA</title>', '<title>Equinor</title>')
content = content.replace('<link rel="icon" type="image/svg+xml" href="/equinor.svg" />', '<link rel="icon" href="/equinor-logo.png" />')

with open('index.html', 'w') as f:
    f.write(content)

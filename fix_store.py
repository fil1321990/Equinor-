import sys
import re

with open("src/store.tsx", "r") as f:
    content = f.read()

# Fix the hook declaration
content = content.replace("const [showCSIcon,\n        showInAppCS, setShowCSIcon] = useState<boolean>(true);", "const [showCSIcon, setShowCSIcon] = useState<boolean>(true);")

with open("src/store.tsx", "w") as f:
    f.write(content)

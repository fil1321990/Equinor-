import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("px-6 py-2.5 rounded-[20px]", "px-4 py-2.5 rounded-[20px]")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Buttons patched")

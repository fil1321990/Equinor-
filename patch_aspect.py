import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("aspect-[21/9]", "aspect-[16/9]")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

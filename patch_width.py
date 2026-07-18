import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '          {activeTab === "mine" && (\n            <div className="pb-6 relative z-10 w-full max-w-md mx-auto">'
replacement = '          {activeTab === "mine" && (\n            <div className="pb-6 relative z-10 w-full">'

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)

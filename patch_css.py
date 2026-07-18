import sys

with open("src/index.css", "r") as f:
    content = f.read()

scrollbar_css = """
/* Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
"""

if "::-webkit-scrollbar" not in content:
    with open("src/index.css", "a") as f:
        f.write(scrollbar_css)
    print("Added scrollbar hiding CSS")
else:
    print("Scrollbar CSS already exists")

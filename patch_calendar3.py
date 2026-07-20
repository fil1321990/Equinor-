import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

pattern = re.compile(
    r'(\{checked && \(\s*<div className="w-4 h-4 bg-\[#FFC107\].*?</div>\s*\)\})', re.DOTALL
)

def repl(match):
    return """{checked ? (
                            <div className="w-4 h-4 bg-[#FFC107] rounded-full flex items-center justify-center shadow-sm shrink-0">
                              <Check className="text-[#0a0a1a] w-3 h-3 stroke-[4]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 shrink-0" />
                          )}"""

new_content = pattern.sub(repl, content)

with open("src/App.tsx", "w") as f:
    f.write(new_content)

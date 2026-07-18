import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Top Navigation */}"""

replacement = """                    </button>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
        {/* Top Navigation */}"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")

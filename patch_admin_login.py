import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              <button 
                onClick={() => {
                  if (!loginIdentifier || !loginPassword) return triggerVisualNotification("alert", "Notice", "Enter credentials");
                  handleLoginSubmit();
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-4 active:scale-95 transition-transform"
              >
                Log in as Admin
              </button>"""

replacement = """              <button 
                onClick={() => {
                  if (!loginIdentifier || !loginPassword) return triggerVisualNotification("alert", "Notice", "Enter credentials");
                  handleLoginSubmit();
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : "Log in as Admin"}
              </button>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced admin login")
else:
    print("Admin login not found")

with open("src/App.tsx", "w") as f:
    f.write(content)


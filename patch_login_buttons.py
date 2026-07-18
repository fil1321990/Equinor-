import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target_login_user = """              onClick={() => {
                if (!loginIdentifier || !loginPassword) {
                  triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
                  return;
                }
                handleLoginSubmit();
              }}
              className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform"
            >
              Log in
            </button>"""

replacement_login_user = """              onClick={() => {
                if (!loginIdentifier || !loginPassword) {
                  triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
                  return;
                }
                handleLoginSubmit();
              }}
              className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform flex items-center justify-center gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : "Log in"}
            </button>"""

if target_login_user in content:
    content = content.replace(target_login_user, replacement_login_user)
else:
    print("User login button not found")


target_signup = """                onClick={async () => {
                  if (!registerForm.agreed) {
                    triggerVisualNotification("alert", "Notice", "Please read and agree to the Privacy agreement.");
                    return;
                  }
                  if (!registerForm.phone || !registerForm.password) {
                    triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
                    return;
                  }
                  if (registerForm.password !== registerForm.confirmParams) {
                    triggerVisualNotification("alert", "Notice", "Passwords do not match.");
                    return;
                  }
                  if (!registerForm.invitationCode || registerForm.invitationCode.trim() === '') {
                    triggerVisualNotification("alert", "Notice", "Please enter the invitation code.");
                    return;
                  }
                  setIsLoggingIn(true);
                  try {
                    
                    await signup(registerForm.phone, registerForm.password, registerForm.invitationCode);
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform"
              >
                Sign up
              </button>"""

replacement_signup = """                onClick={async () => {
                  if (!registerForm.agreed) {
                    triggerVisualNotification("alert", "Notice", "Please read and agree to the Privacy agreement.");
                    return;
                  }
                  if (!registerForm.phone || !registerForm.password) {
                    triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
                    return;
                  }
                  if (registerForm.password !== registerForm.confirmParams) {
                    triggerVisualNotification("alert", "Notice", "Passwords do not match.");
                    return;
                  }
                  if (!registerForm.invitationCode || registerForm.invitationCode.trim() === '') {
                    triggerVisualNotification("alert", "Notice", "Please enter the invitation code.");
                    return;
                  }
                  setIsLoggingIn(true);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await signup(registerForm.phone, registerForm.password, registerForm.invitationCode);
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                className="w-full bg-[#6B2EFF] text-white py-4 rounded-full font-bold text-lg mt-8 active:scale-95 transition-transform flex items-center justify-center gap-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign up"}
              </button>"""

if target_signup in content:
    content = content.replace(target_signup, replacement_signup)
else:
    print("Signup button not found")

with open("src/App.tsx", "w") as f:
    f.write(content)


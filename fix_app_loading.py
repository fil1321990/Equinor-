import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add isLoggingIn state
content = content.replace(
    'const [loginPassword, setLoginPassword] = useState("");',
    'const [loginPassword, setLoginPassword] = useState("");\n  const [isLoggingIn, setIsLoggingIn] = useState(false);'
)

# Update handleLoginSubmit
old_login = """  const handleLoginSubmit = async () => {
    if (!loginIdentifier || !loginPassword) {
      alert("Please fill in phone number and password.");
      return;
    }
    const res = await login(loginIdentifier, loginPassword);
    if (res?.mustChangePassword && res?.user) {
      setForcePasswordChangeUser(res.user);
    }
  };"""

new_login = """  const handleLoginSubmit = async () => {
    if (!loginIdentifier || !loginPassword) {
      alert("Please fill in phone number and password.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await login(loginIdentifier, loginPassword);
      if (res?.mustChangePassword && res?.user) {
        setForcePasswordChangeUser(res.user);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };"""

content = content.replace(old_login, new_login)

# Add loading view in auth block
old_if_not_user = "if (!currentUser) {\n    if (forcePasswordChangeUser) {"
new_if_not_user = """if (!currentUser) {
    if (isLoggingIn) {
      return (
        <div className="h-[100dvh] md:min-h-screen bg-[#0A0E2E] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <img src="/equinor-logo.png" className="w-16 animate-pulse" alt="Equinor Logo" />
            <p className="text-white mt-4 font-bold tracking-widest uppercase">Equinor</p>
          </div>
        </div>
      );
    }
    if (forcePasswordChangeUser) {"""

content = content.replace(old_if_not_user, new_if_not_user)

with open('src/App.tsx', 'w') as f:
    f.write(content)


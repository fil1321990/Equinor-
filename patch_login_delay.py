import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """  const handleLoginSubmit = async () => {
    if (!loginIdentifier || !loginPassword) {
      triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
      return;
    }
    setIsLoggingIn(true);
    try {
      
      const res = await login(loginIdentifier, loginPassword);"""

replacement = """  const handleLoginSubmit = async () => {
    if (!loginIdentifier || !loginPassword) {
      triggerVisualNotification("alert", "Notice", "Please fill in phone number and password.");
      return;
    }
    setIsLoggingIn(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const res = await login(loginIdentifier, loginPassword);"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced handleLoginSubmit")
else:
    print("Target handleLoginSubmit not found")

with open("src/App.tsx", "w") as f:
    f.write(content)


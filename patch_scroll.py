import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''  useEffect(() => {
     if (isChatOpen) {
        const now = Date.now();
        if (currentUser?.role === 'admin') {
           setAdminLastReadTimestamp(now);
           localStorage.setItem('adminLastReadTimestamp', now.toString());
        } else {
           setUserLastReadTimestamp(now);
           localStorage.setItem('userLastReadTimestamp', now.toString());
        }
     }
  }, [isChatOpen, chatMessages.length, currentUser]);'''

replacement = '''  useEffect(() => {
     if (isChatOpen) {
        setIsScrolledToBottom(true);
     }
  }, [isChatOpen]);

  useEffect(() => {
     if (isChatOpen) {
        const now = Date.now();
        if (currentUser?.role === 'admin') {
           setAdminLastReadTimestamp(now);
           localStorage.setItem('adminLastReadTimestamp', now.toString());
        } else {
           setUserLastReadTimestamp(now);
           localStorage.setItem('userLastReadTimestamp', now.toString());
        }
     }
  }, [isChatOpen, chatMessages.length, currentUser]);'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)


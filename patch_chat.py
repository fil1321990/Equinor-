import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Inject state and effects
target_state = '  const [isChatOpen, setIsChatOpen] = useState(false);\n  const [chatInput, setChatInput] = useState("");'
replacement_state = '''  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const [adminLastReadTimestamp, setAdminLastReadTimestamp] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('adminLastReadTimestamp') || '0', 10); } catch { return 0; }
  });
  const [userLastReadTimestamp, setUserLastReadTimestamp] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('userLastReadTimestamp') || '0', 10); } catch { return 0; }
  });

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
  }, [isChatOpen, chatMessages.length, currentUser]);

  const unreadChatCount = useMemo(() => {
      if (!currentUser) return 0;
      if (currentUser.role === 'admin') {
          return chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser.id && new Date(m.timestamp).getTime() > adminLastReadTimestamp).length;
      } else {
          return chatMessages.filter(m => m.receiverId === currentUser.id && new Date(m.timestamp).getTime() > userLastReadTimestamp).length;
      }
  }, [chatMessages, currentUser, adminLastReadTimestamp, userLastReadTimestamp]);

  useEffect(() => {
    if (isChatOpen && chatScrollRef.current && isScrolledToBottom) {
       chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen, isScrolledToBottom]);

  const handleChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
     setIsScrolledToBottom(scrollHeight - scrollTop - clientHeight < 50);
  };'''

if target_state in content:
    content = content.replace(target_state, replacement_state)
else:
    print("Could not find target_state")

# 2. Update home page View Support Chats button
target_home_chat = '''                      {chatMessages.filter(m => m.receiverId === currentUser?.id || (!m.receiverId && m.senderId !== currentUser?.id)).length > 0 && (
                        <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                          {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
                        </span>
                      )}'''

replacement_home_chat = '''                      {unreadChatCount > 0 && (
                        <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white/20">
                          {unreadChatCount}
                        </span>
                      )}'''

content = content.replace(target_home_chat, replacement_home_chat)

# 3. Update Mine page View Support Chats button
target_mine_chat = '''                  {chatMessages.filter(m => m.receiverId === currentUser?.id || (!m.receiverId && m.senderId !== currentUser?.id)).length > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                      {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
                    </span>
                  )}'''

replacement_mine_chat = '''                  {unreadChatCount > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white/20">
                      {unreadChatCount}
                    </span>
                  )}'''

content = content.replace(target_mine_chat, replacement_mine_chat)

# 4. Update the floating icon badge
target_floating_chat = '''          {currentUser.role === 'admin' && chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {chatMessages.filter(m => !m.receiverId && m.senderId !== currentUser?.id).length}
            </span>
          )}'''

replacement_floating_chat = '''          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
              {unreadChatCount}
            </span>
          )}'''

content = content.replace(target_floating_chat, replacement_floating_chat)

# 5. Fix the chat modal auto-scroll and container
target_chat_scroll = '''            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" ref={(el) => { if (el) { el.scrollTop = el.scrollHeight; } }}>'''

replacement_chat_scroll = '''            <div 
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" 
              ref={chatScrollRef}
              onScroll={handleChatScroll}
            >'''

content = content.replace(target_chat_scroll, replacement_chat_scroll)

with open("src/App.tsx", "w") as f:
    f.write(content)


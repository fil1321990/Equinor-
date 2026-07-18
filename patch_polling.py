import sys

with open("src/store.tsx", "r") as f:
    content = f.read()

target = """  useEffect(() => {
    // Use Supabase realtime instead of aggressive polling
    const subscription = supabase
      .channel('public_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setChatMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          const updated = [...prev, payload.new as ChatMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { globalMutate('appData'); })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);"""

replacement = """  useEffect(() => {
    // Add aggressive polling as a fallback to ensure data reflects smoothly without refresh
    const interval = setInterval(() => {
      globalMutate('appData');
    }, 5000);

    const subscription = supabase
      .channel('public_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setChatMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          const updated = [...prev, payload.new as ChatMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => { globalMutate('appData'); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => { globalMutate('appData'); })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced polling")
else:
    print("Polling target not found")

with open("src/store.tsx", "w") as f:
    f.write(content)

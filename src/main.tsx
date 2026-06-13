import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './supabase';

supabase.rpc('query', { 
  query_text: `
  CREATE TABLE IF NOT EXISTS chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "senderId" text,
    "receiverId" text,
    text text,
    timestamp timestamp with time zone,
    read boolean DEFAULT false
  );
  ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
  do $$
  begin
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages') then
      alter publication supabase_realtime add table chat_messages;
    end if;
  end;
  $$;
`
}).then(res => {
  console.log("Chat setup result:", res);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

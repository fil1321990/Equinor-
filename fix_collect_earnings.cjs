const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target = `      const { data: userData } = await supabase.from('users').select('*').eq('id', currentUser.id).single();
      const updatedBalance = Number(userData?.balance || currentUser.balance) + totalToAdd;
      await supabase.from('users').update({ balance: updatedBalance }).eq('id', currentUser.id);`;

const replacement = `      // Fetch latest balance and use it, but to prevent race conditions during batch processing, 
      // we should use the rpc call if available, or just rely on the frontend state delta.
      // But since we are awaiting each collectEarnings sequentially, we can fetch, but we might hit read replicas.
      // Better approach: use currentUser.balance (which is synchronously updated via setCurrentUser).
      // Since setCurrentUser updates the reference, currentUser inside this function closure is STALE!
      // So we must fetch from the latest local state or use a Supabase RPC.
      // For now, let's fetch from the latest \`users\` state if possible, but we don't have access to it directly in the async flow easily without a ref.
      
      const { data: userData } = await supabase.from('users').select('balance').eq('id', currentUser.id).single();
      // Calculate based on the fetched data
      const currentDbBalance = Number(userData?.balance || 0);
      const updatedBalance = currentDbBalance + totalToAdd;
      
      const { error: updateError } = await supabase.from('users').update({ balance: updatedBalance }).eq('id', currentUser.id);
      if (updateError) {
         console.error("Failed to update balance:", updateError);
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/store.tsx', code);

import { supabase } from './src/supabase.ts';

async function reset() {
  const { error } = await supabase.from('users').update({ balance: 0, referralEarnings: 0, claimedTasks: [] }).eq('role', 'admin');
  if (error) console.error("Error updating admin:", error);
  else console.log("Updated admin balance to 0");
}

reset();

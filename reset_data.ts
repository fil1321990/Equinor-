import { supabase } from './src/supabase.ts';

async function reset() {
  console.log("Starting reset...");
  
  // 1. Delete all non-admin users
  const { data: users, error: uErr } = await supabase.from('users').select('id, role');
  if (uErr) {
    console.error("Error fetching users:", uErr);
    return;
  }
  const toDelete = users.filter(u => u.role !== 'admin');
  console.log(`Found ${toDelete.length} non-admin users to delete.`);
  for (const u of toDelete) {
    const { error } = await supabase.from('users').delete().eq('id', u.id);
    if (error) console.error(`Error deleting user ${u.id}:`, error);
  }

  // 2. Delete all records from transactions
  const { error: tErr } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (tErr) console.error("Error deleting transactions:", tErr);
  else console.log("Deleted transactions");

  // 3. Delete all investments
  const { error: iErr } = await supabase.from('investments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (iErr) console.error("Error deleting investments:", iErr);
  else console.log("Deleted investments");

  // 4. Delete all commissions
  const { error: cErr } = await supabase.from('commissions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (cErr) console.error("Error deleting commissions:", cErr);
  else console.log("Deleted commissions");

  // 5. Delete all incomeRecords
  const { error: inErr } = await supabase.from('incomeRecords').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (inErr) console.error("Error deleting incomeRecords:", inErr);
  else console.log("Deleted incomeRecords");

  console.log("Finished reset!");
}

reset();

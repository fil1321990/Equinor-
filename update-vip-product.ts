import { createClient } from "@supabase/supabase-js";

// We need the supabase keys. Let's read them from the environment or src/supabase.ts
import fs from "fs";
import path from "path";

const supabaseFile = fs.readFileSync(path.join(process.cwd(), "src/supabase.ts"), "utf-8");
const urlMatch = supabaseFile.match(/supabaseUrl = '([^']+)'/);
const keyMatch = supabaseFile.match(/supabaseKey = '([^']+)'/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  
  async function run() {
    const { data: products } = await supabase.from('products').select('*').ilike('name', '%VIP Team Exclusive Project%');
    console.log("Found products:", products);
    
    if (products && products.length > 0) {
      const p = products[0];
      const { data, error } = await supabase.from('products').update({
        fixedDailyReturn: 300,
        days: 500, // Because 150000 / 300 = 500. Total income is daily * days.
      }).eq('id', p.id);
      
      console.log("Update result:", data, error);
    }
  }
  
  run();
} else {
  console.log("Could not find supabase url/key in src/supabase.ts");
}

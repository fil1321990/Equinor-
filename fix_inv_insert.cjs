const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target = `const { data: invData } = await supabase.from('investments').insert(inv).select().single();
    if (invData) setInvestments((prev) => [invData, ...prev]);`;

const replacement = `const { data: invData } = await supabase.from('investments').insert(inv).select().single();
    if (invData) {
      setInvestments((prev) => [invData, ...prev]);
      if (product) {
        const newSoldCount = (product.sold_count || 0) + (quantity || 1);
        await supabase.from('products').update({ sold_count: newSoldCount }).eq('id', product.id);
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, sold_count: newSoldCount } : p));
      }
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/store.tsx', code);

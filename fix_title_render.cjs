const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<h3 className="font-bold text-\[\#1E293B\] text-\[18px\] leading-tight mb-1 truncate">\{plan\.name\}<\/h3>/g,
  `{(() => { let t: any = { color: "#1E293B", size: "18" }; try { const parsed = JSON.parse(plan.title || ""); if (parsed && parsed.text) t = parsed; } catch(e) {} return <h3 className="font-bold leading-tight mb-1 truncate" style={{ color: t.color, fontSize: t.size + 'px' }}>{plan.name}</h3>; })()}`
);

// Order tab
code = code.replace(
  /<h3 className="font-bold text-\[18px\] text-\[\#1A1A1A\] leading-tight mb-1">\{inv\.planName\}<\/h3>/g,
  `{(() => { let t: any = { color: "#1A1A1A", size: "18" }; try { const product = products.find(p => p.name === inv.planName) as any; if (product) { const parsed = JSON.parse(product.title || ""); if (parsed && parsed.text) t = parsed; } } catch(e) {} return <h3 className="font-bold leading-tight mb-1" style={{ color: t.color, fontSize: t.size + 'px' }}>{inv.planName}</h3>; })()}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Title render fixed.");

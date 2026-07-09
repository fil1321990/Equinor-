const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [newProductTitle, setNewProductTitle] = useState("EQUINOR");',
  'const [newProductTitle, setNewProductTitle] = useState("EQUINOR");\n  const [newProductTitleColor, setNewProductTitleColor] = useState("#1E293B");\n  const [newProductTitleSize, setNewProductTitleSize] = useState("18");'
);

// editing logic
code = code.replace(
  'setNewProductTitle(p.title || "EQUINOR");',
  'let parsedTitle: any = { text: p.title || "EQUINOR", color: "#1E293B", size: "18" };\n                              try { const parsed = JSON.parse(p.title); if (parsed && parsed.text) parsedTitle = parsed; } catch(e) {}\n                              setNewProductTitle(parsedTitle.text || "EQUINOR");\n                              setNewProductTitleColor(parsedTitle.color || "#1E293B");\n                              setNewProductTitleSize(parsedTitle.size?.toString() || "18");'
);

// clear logic for add product
code = code.replace(
  'setNewProductTitle("EQUINOR");',
  'setNewProductTitle("EQUINOR");\n                      setNewProductTitleColor("#1E293B");\n                      setNewProductTitleSize("18");'
);

// addProduct submit
code = code.replace(
  'title: newProductTitle,',
  'title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize }),'
);

// editProduct submit
code = code.replace(
  'title: newProductTitle,',
  'title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize }),'
);

fs.writeFileSync('src/App.tsx', code);
console.log("State and submit logic fixed.");

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const fields = `                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Title Color</label>
                    <input
                      type="color"
                      value={newProductTitleColor}
                      onChange={(e) => setNewProductTitleColor(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Title Size (px)</label>
                    <input
                      type="number"
                      value={newProductTitleSize}
                      onChange={(e) => setNewProductTitleSize(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[#0A0E2E] font-medium"
                      placeholder="18"
                    />
                  </div>
                </div>`;

code = code.replace(
  /placeholder="e\.g\. Starter VIP"\n                  \/>\n                <\/div>/g,
  'placeholder="e.g. Starter VIP"\n                  />\n                </div>\n' + fields
);

fs.writeFileSync('src/App.tsx', code);
console.log("Inputs added.");

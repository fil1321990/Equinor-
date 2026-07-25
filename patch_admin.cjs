const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const [newProductQuota, setNewProductQuota] = useState("0");',
  'const [newProductQuota, setNewProductQuota] = useState("0");\n  const [newProductGlobalQuota, setNewProductGlobalQuota] = useState("0");'
);

content = content.replace(
  'setNewProductQuota("0");',
  'setNewProductQuota("0"); setNewProductGlobalQuota("0");'
);
content = content.replace(
  'setNewProductQuota("0");',
  'setNewProductQuota("0"); setNewProductGlobalQuota("0");'
);

content = content.replace(
  'maxQuota: Number(newProductQuota),',
  'maxQuota: Number(newProductQuota),\n                        globalQuota: Number(newProductGlobalQuota),'
);
content = content.replace(
  'maxQuota: Number(newProductQuota),',
  'maxQuota: Number(newProductQuota),\n                        globalQuota: Number(newProductGlobalQuota),'
);

const field1 = `                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Max Quota (0 for unlimited)</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setNewProductQuota(String(Math.max(0, Number(newProductQuota) - 1)))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">-</button>
                    <input
                      type="number"
                      required
                      value={newProductQuota}
                      onChange={(e) => setNewProductQuota(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium text-center"
                      placeholder="e.g. 1"
                    />
                    <button type="button" onClick={() => setNewProductQuota(String(Number(newProductQuota) + 1))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">+</button>
                  </div>
                </div>`;

const field1Replacement = `                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Total stock / Global quota (0 = unlimited)</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setNewProductGlobalQuota(String(Math.max(0, Number(newProductGlobalQuota) - 1)))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">-</button>
                    <input
                      type="number"
                      required
                      value={newProductGlobalQuota}
                      onChange={(e) => setNewProductGlobalQuota(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium text-center"
                      placeholder="e.g. 1000"
                    />
                    <button type="button" onClick={() => setNewProductGlobalQuota(String(Number(newProductGlobalQuota) + 1))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Purchase limit / Per user quota (0 = unlimited)</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setNewProductQuota(String(Math.max(0, Number(newProductQuota) - 1)))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">-</button>
                    <input
                      type="number"
                      required
                      value={newProductQuota}
                      onChange={(e) => setNewProductQuota(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium text-center"
                      placeholder="e.g. 1"
                    />
                    <button type="button" onClick={() => setNewProductQuota(String(Number(newProductQuota) + 1))} className="bg-slate-200 p-3 rounded-lg font-bold text-slate-700 w-12 flex items-center justify-center hover:bg-slate-300">+</button>
                  </div>
                </div>`;

content = content.replace(field1, field1Replacement);
content = content.replace(field1, field1Replacement);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched admin fields');

import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target1 = '''                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Profit Percentage (Total ROI %)</label>
                  <input
                    type="number"
                    required={!newProductFixedDaily}
                    value={newProductRoi}
                    onChange={(e) => setNewProductRoi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium"
                    placeholder="e.g. 12"
                  />
                </div>'''

replacement1 = ''''''

content = content.replace(target1, replacement1)

target2 = '''                  if (newProductName && (newProductRoi || newProductFixedDaily) && newProductMin && newProductDays && newProductType) {'''
replacement2 = '''                  if (newProductName && newProductFixedDaily && newProductMin && newProductDays && newProductType) {'''
content = content.replace(target2, replacement2)

target3 = '''                  if (newProductName && newProductRoi && newProductMin && newProductDays && newProductType) {'''
replacement3 = '''                  if (newProductName && newProductFixedDaily && newProductMin && newProductDays && newProductType) {'''
content = content.replace(target3, replacement3)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

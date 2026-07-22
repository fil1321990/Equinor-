import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Fixed Daily Income (Optional)</label>
                  <input
                    type="number"
                    value={newProductFixedDaily}'''

replacement = '''                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Daily Income</label>
                  <input
                    type="number"
                    required
                    value={newProductFixedDaily}'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

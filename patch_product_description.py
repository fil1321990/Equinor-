import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update population when editing
target1 = '''                              setNewProductTitleSize(parsedTitle.size?.toString() || "18");
                              setNewProductDescription(p.description || "");
                              setNewProductFixedDaily'''

replacement1 = '''                              setNewProductTitleSize(parsedTitle.size?.toString() || "18");
                              let parsedDesc: any = { text: p.description || "", color: "" };
                              try { const pD = JSON.parse(p.description || ""); if (pD.text !== undefined) parsedDesc = pD; } catch(e) {}
                              setNewProductDescription(parsedDesc.text);
                              setNewProductDescColor(parsedDesc.color || "");
                              setNewProductFixedDaily'''

content = content.replace(target1, replacement1)

# 2. Update addProduct submit
target2 = '''                        title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize, audienceType: newProductAudienceType }),
                        description: newProductDescription,
                        roi:'''

replacement2 = '''                        title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize, audienceType: newProductAudienceType }),
                        description: JSON.stringify({ text: newProductDescription, color: newProductDescColor }),
                        roi:'''

content = content.replace(target2, replacement2)

# 3. Update editProduct submit
target3 = '''                        title: JSON.stringify({ text: newProductTitle, color: newProductTitleColor, size: newProductTitleSize, audienceType: newProductAudienceType }),
                        description: newProductDescription,
                        roi:'''

# (Wait, target2 is the same for add and edit, so replacing target2 will replace both occurrences)

# Let's write a targeted function to inject the newProductDescColor input in the form
# There are two occurrences of the Product Description textarea.

target4 = '''                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Description</label>
                  <textarea
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium resize-none h-24"
                    placeholder="Enter product description..."
                  />
                </div>'''

replacement4 = '''                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Product Description</label>
                  <textarea
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#0A0E2E] font-medium resize-none h-24"
                    placeholder="Enter product description..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Description Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newProductDescColor || "#000000"}
                      onChange={(e) => setNewProductDescColor(e.target.value)}
                      className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl p-1 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newProductDescColor}
                      onChange={(e) => setNewProductDescColor(e.target.value)}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[#0A0E2E] font-medium"
                      placeholder="#FFFFFF or Leave empty for default"
                    />
                  </div>
                </div>'''

content = content.replace(target4, replacement4)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# First revert the previous addition
target_remove = '''                {/* Preview block */}
                {(newProductRoi || newProductFixedDaily) && newProductMin && newProductDays && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
                    <p className="text-[10px] font-bold text-indigo-800 mb-2 uppercase tracking-wider">Income Preview</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Daily Income</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? Number(newProductFixedDaily).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100) / Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Total Return</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? (Number(newProductFixedDaily) * Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Profit Percentage (Total ROI %)</label>'''

content = content.replace(target_remove, '''                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Profit Percentage (Total ROI %)</label>''')

# Now add it after "Duration (Days)"
target_insert = '''                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">T+ (Earning Cycle in Days)</label>'''

replacement_insert = '''                {/* Preview block */}
                {(newProductRoi || newProductFixedDaily) && newProductMin && newProductDays && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-indigo-800 mb-2 uppercase tracking-wider">Income Preview</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Daily Income</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? Number(newProductFixedDaily).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100) / Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Total Return</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? (Number(newProductFixedDaily) * Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">T+ (Earning Cycle in Days)</label>'''

content = content.replace(target_insert, replacement_insert)

with open("src/App.tsx", "w") as f:
    f.write(content)


import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                {/* Preview block */}
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
                )}'''

replacement = '''                {/* Preview block */}
                {(newProductRoi || newProductFixedDaily) && newProductMin && newProductDays && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-indigo-800 mb-2 uppercase tracking-wider">Income Preview</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Daily Income</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? Number(newProductFixedDaily).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100) / Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Total Return</p>
                        <p className="text-[14px] font-bold text-indigo-900">₦{newProductFixedDaily ? (Number(newProductFixedDaily) * Number(newProductDays)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : (Number(newProductMin) * (1 + Number(newProductRoi) / 100)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-indigo-600 font-medium">Effective ROI</p>
                        <p className="text-[14px] font-bold text-indigo-900">{newProductFixedDaily ? ((((Number(newProductFixedDaily) * Number(newProductDays)) - Number(newProductMin)) / Number(newProductMin)) * 100).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : Number(newProductRoi).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}%</p>
                      </div>
                    </div>
                  </div>
                )}'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)


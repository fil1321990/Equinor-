import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-2">
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                <span className="text-[#5B5FEF]/80 text-[11px]">24H Returns:</span>
                                <span className="text-[#5B5FEF] font-medium text-[12px] ml-1">₦{get24h.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center whitespace-nowrap bg-[#E8E9FF] px-2 py-1 rounded-[8px] text-[#5B5FEF]">
                                <span className="text-[#5B5FEF]/80 text-[11px]">Cycle:</span>
                                <span className="text-[#5B5FEF] font-medium text-[12px] ml-1">{plan.total_duration_days || plan.days} Days</span>
                              </div>
                            </div>
                          </div>'''

replacement = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-1 w-full mt-2">
                            <div className="bg-white rounded-[16px] p-4 w-full shadow-sm border border-slate-100">
                              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  24H Returns: ₦{get24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="flex items-center text-[#1A1A1A] text-[13px]">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                              </div>
                            </div>
                          </div>'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

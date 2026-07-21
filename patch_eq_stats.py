import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                          {/* Stats Grid Bottom Section */}
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

replacement = '''                          {/* Stats Grid Bottom Section */}
                          <div className="pb-1 w-full mt-2">
                            <div className="bg-white rounded-[12px] px-3 py-2.5 w-full shadow-sm border border-slate-100">
                              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  24H Returns: ₦{get24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                                <div className="flex items-center font-bold text-[#1A1A1A] text-[12px] whitespace-nowrap">
                                  Cycle: {plan.total_duration_days || plan.days} Days
                                </div>
                              </div>
                            </div>
                          </div>'''

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")

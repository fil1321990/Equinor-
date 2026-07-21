import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '''                {/* FAQ Section */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#3B82F6]" />
                    FAQ - Payments
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">How fast are withdrawals processed?</h5>
                      <p className="text-cyan-100 text-[14.5px] leading-relaxed">Withdrawals are generally processed within 24 hours. Once approved, the funds are immediately routed to your designated bank account or USDT wallet.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">Are there any deposit fees?</h5>
                      <p className="text-cyan-100 text-[14.5px] leading-relaxed">We do not charge any internal fees for deposits. Please ensure you transfer the exact amount displayed during the recharge process.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">What is the minimum withdrawal amount?</h5>
                      <p className="text-cyan-100 text-[14.5px] leading-relaxed">The minimum withdrawal amount is ₦6,000 to ensure efficient processing and coverage of standard network operations.</p>
                    </div>
                  </div>
                </div>'''

replacement = '''                {/* FAQ Section */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#3B82F6]" />
                    FAQ - Payments
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">How fast are withdrawals processed?</h5>
                      <p className="text-[#10B981] text-[14.5px] leading-relaxed">Withdrawals are generally processed within 24 hours. Once approved, the funds are immediately routed to your designated bank account or USDT wallet.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">Are there any deposit fees?</h5>
                      <p className="text-[#10B981] text-[14.5px] leading-relaxed">We do not charge any internal fees for deposits. Please ensure you transfer the exact amount displayed during the recharge process.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h5 className="font-semibold text-white text-[15px] mb-1.5">What is the minimum withdrawal amount?</h5>
                      <p className="text-[#10B981] text-[14.5px] leading-relaxed">The minimum withdrawal amount is ₦6,000 to ensure efficient processing and coverage of standard network operations.</p>
                    </div>
                  </div>
                </div>'''

if target in content:
    content = content.replace(target, replacement)
    print("Replaced successfully")
else:
    print("Target not found")

with open("src/App.tsx", "w") as f:
    f.write(content)


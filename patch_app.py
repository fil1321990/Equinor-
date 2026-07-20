import sys
import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add showInAppCS to store destructuring
content = content.replace("showCSIcon,", "showCSIcon,\n    showInAppCS,\n    updateShowInAppCS,")

# Update bottom chat button to use showInAppCS
content = content.replace("{currentUser && !isChatOpen && showCSIcon && (", "{currentUser && !isChatOpen && showInAppCS && (")

# Update admin panel
admin_toggle_target = """                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10 mt-2">
                    <span className="text-white text-sm font-bold">Show CS Chat Icon</span>
                    <button
                      onClick={() => updateShowCSIcon(!showCSIcon)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${showCSIcon ? 'bg-[#7B2FFF]' : 'bg-white/20'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showCSIcon ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>"""

admin_toggle_replacement = """                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                      <span className="text-white text-sm font-bold">Show WhatsApp CS Icon</span>
                      <button
                        onClick={() => updateShowCSIcon(!showCSIcon)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${showCSIcon ? 'bg-[#7B2FFF]' : 'bg-white/20'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showCSIcon ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                      <span className="text-white text-sm font-bold">Show In-App Chat Icon</span>
                      <button
                        onClick={() => updateShowInAppCS(!showInAppCS)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors ${showInAppCS ? 'bg-[#7B2FFF]' : 'bg-white/20'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${showInAppCS ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>"""

content = content.replace(admin_toggle_target, admin_toggle_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

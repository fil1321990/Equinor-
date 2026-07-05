import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update orderTab state initialization
content = content.replace(
    'const [orderTab, setOrderTab] = useState<"general" | "vip" | "special" | "expired">("general");',
    'const [orderTab, setOrderTab] = useState<"general" | "special" | "expired">("general");'
)

# 2. Add useEffect for refreshProducts on tab change
use_effect_str = """
  useEffect(() => {
    if (activeTab === "order" || activeTab === "product") {
      refreshProducts();
    }
  }, [activeTab, orderTab, productTab, refreshProducts]);
"""
# Insert after activeTeamTab definition
content = content.replace(
    'const [activeTeamTab, setActiveTeamTab] = useState<"A" | "B" | "C">("A");',
    'const [activeTeamTab, setActiveTeamTab] = useState<"A" | "B" | "C">("A");\n' + use_effect_str
)

# 3. Modify the tabs in Order Tab
# Find the Order Tab section
order_tab_nav = """{(["general", "vip", "special", "expired"] as const).map(tab => {"""
new_order_tab_nav = """{(["general", "special", "expired"] as const).map(tab => {"""
content = content.replace(order_tab_nav, new_order_tab_nav)

content = content.replace(
    'bg-[#8A63FF]',
    'bg-[#B84CF6]'
)

# 4. Modify filteredInvestments
# if (orderTab === "vip") return !isExpired && pType === "vip";
content = content.replace(
    'if (orderTab === "vip") return !isExpired && pType === "vip";',
    '// vip tab removed'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update Product tab filter
old_prod_filter = """products.filter((p: any) => {
                  const pType = (p.product_type || p.type || 'general').toLowerCase();
                  const isVip = p.is_vip === true || pType === 'vip';
                  const isActive = p.status ? p.status === 'active' : true;
                  if (!isActive) return false;
                  if (productTab === 'special') return pType === 'special' || isVip;
                  if (productTab === 'vip') return isVip;
                  return pType === productTab.toLowerCase();
                })"""

new_prod_filter = """products.filter((p: any) => {
                  const pType = (p.product_type || p.type || 'general').toLowerCase();
                  const isVip = p.is_vip === true || pType === 'vip' || (p.category && p.category.toLowerCase() === 'vip');
                  const isActive = p.status ? p.status === 'active' : (p.is_active !== false);
                  if (!isActive) return false;
                  if (productTab === 'special') return pType === 'special' || isVip;
                  if (productTab === 'vip') return isVip;
                  return pType === productTab.toLowerCase() && !isVip;
                })"""
                
content = content.replace(old_prod_filter + ".length === 0", new_prod_filter + ".length === 0")
content = content.replace(old_prod_filter + ".map((plan: any) => {", new_prod_filter + ".map((plan: any) => {")

# Update Investment filter
old_inv_filter = """            const filteredInvestments = investments.filter(inv => {
              if (inv.userId !== currentUser?.id) return false;
              const now = new Date();
              const isExpired = inv.status === "completed" || now.getTime() >= new Date(inv.endDate).getTime();
              const product = products.find(p => p.name === inv.planName) as any;
              const pType = product ? (product.product_type || product.type || "general") : "general";
              const isVip = product ? (product.is_vip === true || pType === "vip") : false;
              
              if (orderTab === "expired") return isExpired;
              if (orderTab === "general") return !isExpired && pType === "general";
              // Special tab shows products where product_type = 'special' OR is_vip = true
              if (orderTab === "special") return !isExpired && (pType === "special" || isVip);
              return false;
            });"""

new_inv_filter = """            const filteredInvestments = investments.filter(inv => {
              if (inv.userId !== currentUser?.id) return false;
              const now = new Date();
              const isExpired = inv.status === "completed" || now.getTime() >= new Date(inv.endDate).getTime();
              const product = products.find(p => p.name === inv.planName) as any;
              const pType = product ? (product.product_type || product.type || "general") : "general";
              const isVip = product ? (product.is_vip === true || pType === "vip" || (product.category && product.category.toLowerCase() === 'vip')) : false;
              
              if (orderTab === "expired") return isExpired;
              if (orderTab === "general") return !isExpired && pType === "general" && !isVip;
              // Special tab shows products where product_type = 'special' OR category = 'VIP'
              if (orderTab === "special") return !isExpired && (pType === "special" || isVip);
              return false;
            });"""

content = content.replace(old_inv_filter, new_inv_filter)

with open('src/App.tsx', 'w') as f:
    f.write(content)

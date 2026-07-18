import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("₦{formatCurrency", "{formatCurrency")
content = content.replace("₦ {formatCurrency", "{formatCurrency")
content = content.replace("+₦{formatCurrency", "+{formatCurrency")
# Wait, replacing "₦{formatCurrency" also covers "+₦{formatCurrency" if we replace the first part.
# Let's be careful. "+₦{formatCurrency" -> "+{formatCurrency".
# Wait, "₦{formatCurrency" would replace the "₦{formatCurrency" in "+₦{formatCurrency", leaving just "+{formatCurrency", which is correct!

with open("src/App.tsx", "w") as f:
    f.write(content)
print("Done")

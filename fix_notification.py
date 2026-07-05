import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Modify type definition
content = content.replace(
    "const [notificationData, setNotificationData] = useState<{type: VisualNotificationType, title: string, subtitle: string}>({ type: 'purchase_success', title: '', subtitle: '' });",
    "const [notificationData, setNotificationData] = useState<{type: VisualNotificationType, title: string, subtitle: string, amount?: number}>({ type: 'purchase_success', title: '', subtitle: '' });"
)

content = content.replace(
    "const triggerVisualNotification = (type: VisualNotificationType, title: string, subtitle: string) => {",
    "const triggerVisualNotification = (type: VisualNotificationType, title: string, subtitle: string, amount?: number) => {"
)

content = content.replace(
    "setNotificationData({ type, title, subtitle });",
    "setNotificationData({ type, title, subtitle, amount });"
)

content = content.replace(
    'triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor");',
    'triggerVisualNotification("purchase_success", "PURCHASE SUCCESSFUL", "Thank you for choosing Equinor", totalAmount);'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)


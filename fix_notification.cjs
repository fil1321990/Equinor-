const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [notificationData, setNotificationData] = useState<{type: VisualNotificationType, title: string, subtitle: string, amount?: number}>({ type: \'purchase_success\', title: \'\', subtitle: \'\' });',
  'const [showVisualNotification, setShowVisualNotification] = useState(false);\n  const [notificationData, setNotificationData] = useState<{type: VisualNotificationType, title: string, subtitle: string, amount?: number}>({ type: \'purchase_success\', title: \'\', subtitle: \'\' });'
);

code = code.replace(
  'setActiveModal("visualNotification");',
  'setShowVisualNotification(true);'
);

code = code.replace(
  '{activeModal === "visualNotification" && (',
  '{showVisualNotification && ('
);

code = code.replace(
  `onClick={() => {
              setActiveModal(null);
              if (notificationData.type === 'purchase_success') {
                setActiveTab("mine");
              }
            }}`,
  `onClick={() => {
              setShowVisualNotification(false);
              if (notificationData.type === 'purchase_success') {
                setActiveTab("mine");
              }
            }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Notification fixed.");

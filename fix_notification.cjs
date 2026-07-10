const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{\n\s*setActiveModal\(null\);\n\s*if \(notificationData\.type === 'purchase_success'\) \{\n\s*setOrderTab\("general"\);\n\s*setActiveTab\("order"\);\n\s*\}\n\s*\}\}/g,
  `onClick={() => {
              setShowVisualNotification(false);
              if (notificationData.type === 'purchase_success') {
                setOrderTab("general");
                setActiveTab("order");
              }
            }}`
);

code = code.replace(
  /<button onClick=\{\(\) => setActiveModal\(null\)\} className="w-full h-12 rounded-full bg-gray-900 text-white font-bold tracking-wide active:scale-95 transition-transform">Okay<\/button>/g,
  `<button onClick={() => setShowVisualNotification(false)} className="w-full h-12 rounded-full bg-gray-900 text-white font-bold tracking-wide active:scale-95 transition-transform">Okay</button>`
);

fs.writeFileSync('src/App.tsx', code);

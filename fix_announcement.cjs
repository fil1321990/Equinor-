const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [buyingQuantity, setBuyingQuantity] = useState("1");',
  'const [buyingQuantity, setBuyingQuantity] = useState("1");\n  const [localAnnouncement, setLocalAnnouncement] = useState(announcement || "");'
);

code = code.replace(
  `                    <input \n                      type="text" \n                      placeholder="Enter announcement text... (leave empty to clear)"\n                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7B2FFF]"\n                      value={announcement || ""}\n                      onChange={(e) => setAnnouncement(e.target.value || null)}\n                    />\n                    <button \n                      onClick={() => triggerVisualNotification("alert", "Notice", 'Announcement saved')}`,
  `                    <input \n                      type="text" \n                      placeholder="Enter announcement text... (leave empty to clear)"\n                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7B2FFF]"\n                      value={localAnnouncement}\n                      onChange={(e) => setLocalAnnouncement(e.target.value)}\n                    />\n                    <button \n                      onClick={() => { setAnnouncement(localAnnouncement || null); triggerVisualNotification("alert", "Notice", 'Announcement saved'); }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Announcement fixed.");

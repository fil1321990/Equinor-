import sys
import re

with open("src/store.tsx", "r") as f:
    content = f.read()

# Add to interface StoreState
content = content.replace("showCSIcon: boolean;", "showCSIcon: boolean;\n  showInAppCS: boolean;")

# Add to function updateShowCSIcon signature and body
content = content.replace(
    "updateShowCSIcon: (show: boolean) => void;",
    "updateShowCSIcon: (show: boolean) => void;\n  updateShowInAppCS: (show: boolean) => void;"
)

# Add to the hook state
content = content.replace(
    "const [showCSIcon, setShowCSIcon] = useState<boolean>(true);",
    "const [showCSIcon, setShowCSIcon] = useState<boolean>(true);\n  const [showInAppCS, setShowInAppCS] = useState<boolean>(true);"
)

# Parse from DB
def replace_db_parse(match):
    return """
        let csConfig = { whatsapp: true, inApp: true };
        if (settingsData.adminWhatsApp) {
          try {
            if (settingsData.adminWhatsApp === "false" || settingsData.adminWhatsApp === "true") {
               csConfig.whatsapp = settingsData.adminWhatsApp === "true";
            } else {
               csConfig = JSON.parse(settingsData.adminWhatsApp);
            }
          } catch(e) {}
        }
        setShowCSIcon(csConfig.whatsapp);
        setShowInAppCS(csConfig.inApp);"""

content = re.sub(r'setShowCSIcon\(settingsData\.adminWhatsApp !== "false"\);', replace_db_parse, content)

# updateShowCSIcon function
def replace_update_func(match):
    return """const updateShowCSIcon = async (show: boolean) => {
    setShowCSIcon(show);
    const newConfig = { whatsapp: show, inApp: showInAppCS };
    await updateSetting('adminWhatsApp', JSON.stringify(newConfig));
  };
  
  const updateShowInAppCS = async (show: boolean) => {
    setShowInAppCS(show);
    const newConfig = { whatsapp: showCSIcon, inApp: show };
    await updateSetting('adminWhatsApp', JSON.stringify(newConfig));
  };"""

content = re.sub(
    r'const updateShowCSIcon = async \(show: boolean\) => \{.*?\};',
    replace_update_func,
    content,
    flags=re.DOTALL
)

# return object
content = content.replace("showCSIcon,", "showCSIcon,\n        showInAppCS,")
content = content.replace("updateShowCSIcon,", "updateShowCSIcon,\n        updateShowInAppCS,")


with open("src/store.tsx", "w") as f:
    f.write(content)

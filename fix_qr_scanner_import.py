import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('import QrScanner from "react-qr-scanner";', 'import { Scanner as QrScanner } from "@yudiel/react-qr-scanner";')

# Now let's change the usage
# The old one:
#                    <QrScanner
#                      delay={300}
#                      style={{ width: '100%' }}
#                      onError={(err: any) => {
#                        console.error(err);
#                        setToastMessage("Error accessing camera");
#                        setIsScanningQR(false);
#                      }}
#                      onScan={async (data: any) => { ... }}
#                    />

old_scanner_block = """                    <QrScanner
                      delay={300}
                      style={{ width: '100%' }}
                      onError={(err: any) => {
                        console.error(err);
                        setToastMessage("Error accessing camera");
                        setIsScanningQR(false);
                      }}
                      onScan={async (data: any) => {"""

new_scanner_block = """                    <QrScanner
                      styles={{ container: { width: '100%' } }}
                      onError={(err: any) => {
                        console.error(err);
                        setToastMessage("Error accessing camera");
                        setIsScanningQR(false);
                      }}
                      onScan={async (result: any) => {
                        const data = { text: result?.[0]?.rawValue };"""

content = content.replace(old_scanner_block, new_scanner_block)

with open('src/App.tsx', 'w') as f:
    f.write(content)


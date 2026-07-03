const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The replacement function handles the outer container and the inside structure
// Let's replace the outer div
content = content.replace(/className="relative bg-\[\#D3D5DA\] rounded-\[24px\] mb-6 shadow-md overflow-hidden flex flex-col p-1\.5 border-4 border-\[\#0F1B2D\]\/5"/g, 'className="relative bg-[#F4F6FC] rounded-[20px] mb-6 shadow-md overflow-hidden flex flex-col p-4"');

// The top row (T+1 and CP...) is already inside for order card, but needs to be moved above the title.
// Actually, looking at the existing code, it has:
// <div className="px-4 pt-4 flex justify-between items-center h-[32px]">
// Let's update that class
content = content.replace(/className="px-4 pt-4 flex justify-between items-center h-\[32px\]"/g, 'className="flex justify-between items-center mb-3"');
content = content.replace(/<span className="bg-\[\#FFECEC\] text-\[\#FF4D4F\] px-3 py-1 rounded-full font-black text-\[12px\]">/g, '<span className="bg-[#FFE5E5] text-[#FF4444] px-2 py-1 rounded-[6px] font-bold text-[12px]">');
content = content.replace(/<span className="text-\[11px\] font-mono tracking-wider text-\[\#6B7280\]">/g, '<span className="text-[12px] font-bold text-gray-700 uppercase">');
content = content.replace(/<Barcode className="w-10 h-5 text-black" strokeWidth={1} \/>/g, '<Barcode className="w-8 h-4 text-gray-700" strokeWidth={1} />');
content = content.replace(/<Barcode className="w-10 h-5 text-black ml-1" strokeWidth={1} \/>/g, '<Barcode className="w-8 h-4 text-gray-700 ml-1" strokeWidth={1} />');
content = content.replace(/<div className="w-full relative">/g, '<div className="w-full relative mb-4">');

// Move the tag row ABOVE the title? Wait, the tag row is currently "Below Image Row"
// I need to use regex to move the top row above the image or just do a manual string replace.

fs.writeFileSync('src/App.tsx', content);

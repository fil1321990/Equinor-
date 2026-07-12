const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /<div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 flex flex-col items-center">/;
const replacement1 = `<div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100 flex flex-col items-center">`;
code = code.replace(regex1, replacement1);

const regex2 = /<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">/;
const replacement2 = `<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">`;
code = code.replace(regex2, replacement2);

const regex3 = /<Clock className="w-8 h-8 text-blue-600 animate-pulse" \/>/;
const replacement3 = `<Clock className="w-5 h-5 text-blue-600 animate-pulse" />`;
code = code.replace(regex3, replacement3);

const regex4 = /<div className="text-4xl text-slate-900 font-black font-mono tracking-widest">/;
const replacement4 = `<div className="text-3xl text-slate-900 font-black font-mono tracking-widest">`;
code = code.replace(regex4, replacement4);

const regex5 = /<p className="text-slate-500 text-xs mt-3 leading-relaxed">/;
const replacement5 = `<p className="text-slate-500 text-[10px] mt-2 leading-relaxed">`;
code = code.replace(regex5, replacement5);

const regex6 = /<div className="bg-slate-100\/50 p-4 border-b border-slate-200 text-center">/;
const replacement6 = `<div className="bg-slate-100/50 p-2 border-b border-slate-200 text-center">`;
code = code.replace(regex6, replacement6);

const regex7 = /<div className="p-5 flex flex-col gap-4">/;
const replacement7 = `<div className="p-3 flex flex-col gap-3">`;
code = code.replace(regex7, replacement7);

const regex8 = /<div className="mt-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">/;
const replacement8 = `<div className="mt-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">`;
code = code.replace(regex8, replacement8);

const regex9 = /<input\n\s*type="text"/;
const replacement9 = `<input
                  type="text"`;
code = code.replace(regex9, replacement9);

const regex10 = /className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"/;
const replacement10 = `className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"`;
code = code.replace(regex10, replacement10);

const regex11 = /className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 active:scale-95 transition-transform shadow-md shadow-blue-600\/30 text-\[15px\]"/;
const replacement11 = `className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-2 mb-8 active:scale-95 transition-transform shadow-md shadow-blue-600/30 text-[15px]"`;
code = code.replace(regex11, replacement11);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated deposit checkout layout.");

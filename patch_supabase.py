import sys

with open("src/supabase.ts", "r") as f:
    content = f.read()

target = """export const supabase = createClient(supabaseUrl, supabaseAnonKey);"""
replacement = """export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (...args) => {
      const [url, options] = args;
      return fetch(url, { ...options, cache: 'no-store' });
    },
  },
});"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced supabase")
else:
    print("Supabase target not found")

with open("src/supabase.ts", "w") as f:
    f.write(content)

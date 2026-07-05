import fs from 'fs';
const content = fs.readFileSync('src/store.tsx', 'utf-8');
const oldFn = `  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };`;
const newFn = `  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      console.error("Delete error:", error);
      alert("Failed to delete product: " + error.message);
    }
  };`;
if (content.includes(oldFn)) {
  fs.writeFileSync('src/store.tsx', content.replace(oldFn, newFn));
  console.log("Updated deleteProduct");
} else {
  console.log("Could not find deleteProduct function");
}

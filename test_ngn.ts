const n = 1000;
console.log(new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n));

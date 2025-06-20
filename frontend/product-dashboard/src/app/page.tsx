import ProductLoader from "./products/ProductLoader";

export default function ProductsPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Products</h1>
      <ProductLoader />
    </main>
  );
}
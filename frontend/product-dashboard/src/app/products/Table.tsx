"use client";

import { useEffect, useState } from "react";
import { Product } from "../../../next.types";

export default function Table({ products }: { products: Product[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<{ key: keyof Product; direction: "asc" | "desc" } | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    let filtered = products;
    if (globalFilter) {
      const filter = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filter) ||
          p.productcode.toLowerCase().includes(filter)
      );
    }
    if (sorting) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sorting.key];
        const bValue = b[sorting.key];
        if (aValue < bValue) return sorting.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredProducts(filtered);
  }, [products, globalFilter, sorting]);

  const columns: { key: keyof Product; label: string; render?: (value: Product[keyof Product]) => React.ReactNode }[] = [
    { key: "name", label: "Name" },
    { key: "productcode", label: "Product Code" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", render: (v) => `£${Number(v).toFixed(2)}` },
    { key: "stockquantity", label: "Stock" },
    { key: "dateadded", label: "Date Added", render: (v) => new Date(v).toLocaleDateString() },
  ];

  const handleSort = (key: keyof Product) => {
    setSorting((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <input
        type="text"
        className="mb-4 p-2 border rounded w-full"
        placeholder="Filter by name or product code..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="p-2 cursor-pointer select-none"
              >
                {col.label}
                {sorting?.key === col.key && (sorting.direction === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((col) => (
                <td key={col.key as string} className="p-2">
                  {col.render ? col.render(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

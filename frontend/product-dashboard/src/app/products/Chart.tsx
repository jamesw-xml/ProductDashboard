"use client";

import { useMemo, useState } from "react";
import { Product } from "../../../next.types";

export default function Chart({
  products,
  filterProduct,
}: {
  products: Product[];
  filterProduct: (category: string | null) => void;
}) {
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);

  // Calculate stock per category
  const stockPerCategory = useMemo(() => {
    return products.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.stockquantity;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const max = Math.max(...Object.values(stockPerCategory), 1);

  const handleBarClick = (category: string) => {
    filterProduct(category === clickedCategory ? null : category);
    setClickedCategory(category === clickedCategory ? null : category);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Stock per Category</h2>
      <div className="flex items-end gap-4 h-56 mt-6">
        {Object.entries(stockPerCategory).map(([category, value]) => (
          <div key={category} className="flex flex-col items-center">
            <button
              style={{
                height: `${(value / max) * 200}px`,
                width: "40px",
                background:
                  clickedCategory === category
                    ? "rgb(37 99 235)"
                    : "rgb(59 130 246 / 0.7)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              aria-label={`Bar for ${category}`}
              onClick={() => handleBarClick(category)}
            />
            <span className="mt-2 text-xs">{category}</span>
            <span className="text-xs text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

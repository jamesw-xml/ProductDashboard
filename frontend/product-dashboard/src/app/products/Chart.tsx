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
      <div className="flex items-end gap-4 h-56 mt-6 justify-center">
        {Object.entries(stockPerCategory).map(([category, value]) => (
          <div key={category} data-testid={category} className="flex flex-col items-center">
            <button
              data-testid={`${category}-bar`}
              style={{
                height: `${(value / max) * 200}px`,
                width: '10rem',
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

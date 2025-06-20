"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Product } from "../../../next.types";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export default function Chart({ products }: { products: Product[] }) {
  const stockPerCategory = products.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.stockquantity;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(stockPerCategory),
    datasets: [
      {
        label: "Stock Quantity",
        data: Object.values(stockPerCategory),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Stock per Category</h2>
      <Bar data={data} />
    </div>
  );
}

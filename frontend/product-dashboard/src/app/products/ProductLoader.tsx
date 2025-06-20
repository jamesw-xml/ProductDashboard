"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Table from "./Table";
import Chart from "./Chart";
import { Product } from "../../../next.types";

export default function ProductLoader() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5096/api"; 
    axios.get(`${apiUrl}/Product`)
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to fetch products"))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return (
    <div className="flex justify-center items-center py-4">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  return (
    <div>
      <Chart products={products} />
      <Table products={products} />
    </div>
  );
}
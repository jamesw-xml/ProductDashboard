"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Table from "./Table";
import Chart from "./Chart";

export default function ProductLoader() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    axios.get(`${apiUrl}/Product`) // correct your URL here
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to fetch products"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <Chart products={products} />
      <Table products={products} />
    </div>
  );
}
"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export type Product = {
  id: number;
  name: string;
  productcode: string;
  category: string;
  price: number;
  stockquantity: number;
  dateadded: string;
};

export default function Table({ products }: { products: Product[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "productcode",
        header: "Product Code",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `£${info.getValue<number>().toFixed(2)}`,
      },
      {
        accessorKey: "stockquantity",
        header: "Stock",
      },
      {
        accessorKey: "dateadded",
        header: "Date Added",
        cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      if (columnId === "name" || columnId === "productcode") {
        return row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());
      }
      return true;
    },
  });

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
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-2 cursor-pointer select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

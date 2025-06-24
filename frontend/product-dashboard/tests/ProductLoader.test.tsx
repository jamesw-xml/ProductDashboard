import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductLoader from "../src/app/products/ProductLoader";
import axios from "axios";
import React from "react";
import Chart from "../src/app/products/Chart";
import Table from "../src/app/products/Table";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProducts = [
  { id: 1, name: "Test", productcode: "T1", category: "Cat", price: 10, stockquantity: 5, dateadded: "2024-01-01" },
  { id: 2, name: "Test2", productcode: "T2", category: "Cat2", price: 10, stockquantity: 5, dateadded: "2024-01-01" }
];

describe("ProductLoader", () => {
  it("renders loading spinner and then products", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    render(<ProductLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Test")).toBeInTheDocument());
  });

    it("renders loading spinner and then products and then chart filters", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    render(<ProductLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Test")).toBeInTheDocument());
    screen.getByTestId("Cat-bar").click();
    await waitFor(() => {
      expect(screen.queryByText("Test2")).not.toBeInTheDocument();
    });
  });

  it("shows error on fetch fail", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    render(<ProductLoader />);
    await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());
  });
});

describe("Chart", () => {
  it("renders chart title", () => {
    render(<Chart products={mockProducts} filterProduct={() => {}} />);
    expect(screen.getByText(/stock per category/i)).toBeInTheDocument();
    mockProducts.forEach(product => {
      expect(screen.getByTestId(product.category)).toBeInTheDocument();
    });
  });
})

describe("Table", () => {
  it("renders table with products", async () => {
    render(<Table products={mockProducts} />);    
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test2")).toBeInTheDocument();
  });
})
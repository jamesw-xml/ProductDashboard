import { render, screen, waitFor } from "@testing-library/react";
import ProductLoader from "../src/app/products/ProductLoader";
import axios from "axios";
import React from "react";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProducts = [
  { id: 1, name: "Test", productcode: "T1", category: "Cat", price: 10, stockquantity: 5, dateadded: "2024-01-01" }
];

describe("ProductLoader", () => {
  it("renders loading spinner and then products", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });
    render(<ProductLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Test")).toBeInTheDocument());
  });

  it("shows error on fetch fail", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("fail"));
    render(<ProductLoader />);
    await waitFor(() => expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument());
  });
});
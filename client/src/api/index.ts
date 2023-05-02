/**
 * Axios DAL Functions
 */
import axios from "axios";
import { ApiResponse, Category, Item, ValidateResults } from "./interfaces";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export namespace Api {
  // Get Categories
  export async function getCategories() {
    const res = await axiosInstance.get<ApiResponse<ValidateResults, Category[]>>("/categories");
    return res.data;
  }

  // Get Items
  export async function getItems() {
    const res = await axiosInstance.get<ApiResponse<ValidateResults, Item[]>>("/items");
    return res.data;
  }
}

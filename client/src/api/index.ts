/**
 * Axios DAL Functions
 */
import axios from "axios";
import { Category, Item } from "./interfaces";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export namespace Api {
  // Get Categories
  export async function getCategories() {
    const res = await axiosInstance.get<Category[]>("/categories");
    return res.data;
  }

  // Get Items
  export async function getItems() {
    const res = await axiosInstance.get<Item[]>("/items");
    return res.data;
  }
}

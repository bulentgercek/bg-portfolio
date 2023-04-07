/**
 * Axios DAL Functions
 */
import axios from "axios";
import { Asset, Category } from "./interfaces";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

export namespace Api {
  // Get Assets
  export async function getAssets() {
    const res = await axiosInstance.get<Asset[]>("/assets");
    return res.data;
  }
  // Get Categories
  export async function getCategories() {
    const res = await axiosInstance.get<Category[]>("/categories");
    return res.data;
  }
}

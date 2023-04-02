/**
 * TypeORM DAL Types/Interfaces
 *
 * These are the identical versions of
 * Api outputs for Api endpoints
 */
/**
 * Assets
 */
export enum AssetType {
  Image = "image",
  Video = "video",
  Text = "text",
}

export interface Asset {
  id: number;
  name: string;
  type: AssetType;
  text: string | null;
  url: string | null;
  contents: Content[] | null;
  updatedDate: string;
}

/**
 * Categories
 */
export interface Category {
  id: number;
  description: string | null;
  items: Item[] | null;
  parentCategories: Category[] | null;
  childCategories: Category[] | null;
  childCategoriesOrder: number[] | null;
  itemsOrder: number[] | null;
}

/**
 * Contents
 */
export enum ContentType {
  TextBlock = "textBlock",
  ImageGalleryMasonry = "imageGalleryMasonry",
}

export interface Content {
  id: number;
  name: string;
  type: ContentType;
  columns: number;
  item: Item;
  assets: Asset[] | null;
}

/**
 * Items
 */
export interface Item {
  id: number;
  name: string;
  description: string | null;
  link: string | null;
  featured: boolean;
  featuredImageAsset: Asset | null;
  categories: Category[] | null;
  contents: Content[] | null;
  updatedDate: Date;
}

/**
 * Options
 */
export enum OptionCategory {
  System = "system",
  Category = "category",
  Item = "item",
  Content = "content",
  Asset = "asset",
}

export enum OptionType {
  Boolean = "boolean",
  String = "string",
  Number = "number",
}

export interface Option {
  id: number;
  name: string;
  category: OptionCategory;
  type: OptionType;
  value: string | null;
}

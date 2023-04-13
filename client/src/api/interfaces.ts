/**
 * TypeORM Api Types/Interfaces
 *
 * These Types/Interfaces are the identical versions of
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

export type Asset = {
  id: number;
  name: string;
  type: AssetType;
  text: string | null;
  url: string | null;
  contents: Content[] | null;
  updatedDate: string;
};

/**
 * Categories
 */
export type Category = {
  id: number;
  name: string;
  description: string | null;
  items: Item[] | null;
  parentCategory: Category | null;
  childCategories: Category[] | null;
  childCategoriesOrder: number[] | null;
  itemsOrder: number[] | null;
};

/**
 * Contents
 */
export enum ContentType {
  TextBlock = "textBlock",
  ImageGalleryMasonry = "imageGalleryMasonry",
}

export type Content = {
  id: number;
  name: string;
  type: ContentType;
  columns: number;
  item: Item;
  assets: Asset[] | null;
};

/**
 * Items
 */
export type Item = {
  id: number;
  name: string;
  description: string | null;
  link: string | null;
  featured: boolean;
  featuredImageAsset: Asset | null;
  categories: Category[] | null;
  contents: Content[] | null;
  updatedDate: Date;
};

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

export type Option = {
  id: number;
  name: string;
  category: OptionCategory;
  type: OptionType;
  value: string | null;
};

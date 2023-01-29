import { ds } from "./connections";
import { Asset, AssetType } from "./entity/Asset";
import { Content } from "./entity/Content";
import { Portfolio } from "./entity/Portfolio";
import { PortfolioCategory } from "./entity/PortfolioCategory";
import { PortfolioItem } from "./entity/PortfolioItem";

const dummyAssetsData = {
  Assets: [
    {
      name: "Logo",
      type: AssetType.Image,
      url: "https://example.com/logo.jpg",
    },
    {
      name: "Featured",
      type: AssetType.Image,
      url: "https://example.com/image.jpg",
    },
  ],
};

const dummyPortfolioData = {
  name: "BG Portfolio",
  categoriesOrder: [1],
  itemsOrder: [1, 2],
};

export async function deleteAssets() {
  return await ds.createQueryBuilder().delete().from(Asset).execute();
}

export async function deleteContents() {
  return await ds.createQueryBuilder().delete().from(Content).execute();
}

export async function deletePortfolioItems() {
  return await ds.createQueryBuilder().delete().from(PortfolioItem).execute();
}

export async function deletePortfolioCategories() {
  return await ds.createQueryBuilder().delete().from(PortfolioCategory).execute();
}

export async function deletePortfolio() {
  return await ds.createQueryBuilder().delete().from(Portfolio).execute();
}

export async function addDummyAssets() {
  return await ds.manager.insert(Asset, dummyAssetsData.Assets);
}

export async function addDummyContent() {
  const dummyContentData = {
    name: "Image Gallery 1",
    columns: 1,
    asset: await ds.manager.find(Asset),
  };
  const content = ds.manager.create(Content, dummyContentData);

  return await ds.manager.save(Content, content);
}

export async function addDummyPortfolioItems() {
  const dummyPortfolioItemsData = {
    PortfolioItems: [
      {
        title: "Garanti Bank | Basket",
        description: `
        Agency : Alametifarika
        Date : 2011
        Medium : Poster and Magazine Announcement
        Technic : 3D Modeling
        Summary : Garanti Bank 3D illustrations for posters and magazine advertisements
      `,
        link: "",
        portfolioCategory: await ds.manager.find(PortfolioCategory, {
          where: {
            name: "BG Portfolio",
          },
        }),
        content: await ds.manager.find(Content),
        portfolio: await ds.manager.findOneBy(Portfolio, {
          name: "BG Portfolio",
        }),
      },
      {
        title: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
        description: `
        Agency: TBWA
        Date: 2012
        Mecra: Poster
        Technique: 3D Modeling
        Abstract: Poster illustrations prepared for Anadolu Insurance
      `,
        link: "",
        portfolioCategory: await ds.manager.find(PortfolioCategory, {
          where: {
            name: "Printed Media",
          },
        }),
        content: await ds.manager.find(Content),
        portfolio: await ds.manager.findOneBy(Portfolio, {
          name: "BG Portfolio",
        }),
      },
    ],
  };
  return await ds.manager.insert(PortfolioItem, dummyPortfolioItemsData.PortfolioItems);
}

export async function addDummyPortfolioCategories() {
  const dummyPortfolioCategoriesData = {
    name: "Printed Media",
    itemsOrder: [1, 2],
    portfolio: await ds.manager.findOneBy(Portfolio, {
      name: "BG Portfolio",
    }),
  };
  const category = ds.manager.create(PortfolioCategory, dummyPortfolioCategoriesData);
  return await ds.manager.save(PortfolioCategory, category);
}

export async function addDummyPortfolio() {
  const portfolio = ds.manager.create(Portfolio, dummyPortfolioData);
  return await ds.manager.save(Portfolio, portfolio);
}

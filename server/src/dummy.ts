import { ds, dsm } from "./connections";
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

// Delete Dummy Datas
export async function cleanAllEntities() {
  const entities = [Content, Asset, PortfolioCategory, PortfolioItem, Portfolio];
  const tableNames = [
    "assets",
    "contents",
    "portfolio_items",
    "portfolio_categories",
    "portfolios",
  ];
  for (const [index, entity] of entities.entries()) {
    await ds.createQueryBuilder().delete().from(entity).execute();
  }
}

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

export async function addDummyPortfolio() {
  const portfolio = dsm.create(Portfolio, dummyPortfolioData);
  await dsm.save(Portfolio, portfolio);
}

export async function addDummyPortfolioCategories() {
  const data = {
    name: "Printed Media",
    itemsOrder: [1, 2],
    portfolio: await dsm.findOneBy(Portfolio, {
      name: "BG Portfolio",
    }),
  };
  const category = dsm.create(PortfolioCategory, data);
  await dsm.save(PortfolioCategory, category);
}

// Add Dummy Datas
export async function addDummyPortfolioItems() {
  const data = {
    PortfolioItems: [
      {
        title: "Garanti Bank | Basket",
        description: `Agency : Alametifarika
Date : 2011
Medium : Poster and Magazine Announcement
Technic : 3D Modeling
Summary : Garanti Bank 3D illustrations for posters and magazine advertisements`,
        link: "",
        portfolioCategory: await dsm.find(PortfolioCategory, {
          where: {
            name: "Printed Media",
          },
        }),
        portfolio: await dsm.findOneBy(Portfolio, {
          name: "BG Portfolio",
        }),
      },
      {
        title: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
        description: `Agency: TBWA
Date: 2012
Mecra: Poster
Technique: 3D Modeling
Abstract: Poster illustrations prepared for Anadolu Insurance`,
        link: "",
        portfolioCategory: await dsm.find(PortfolioCategory, {
          where: {
            name: "Printed Media",
          },
        }),
        portfolio: await dsm.findOneBy(Portfolio, {
          name: "BG Portfolio",
        }),
      },
    ],
  };

  const saves = data.PortfolioItems.map(async (item) => {
    const newPortfolioItem = dsm.create(PortfolioItem, item);
    await dsm.save(PortfolioItem, newPortfolioItem);
  });
  await Promise.all(saves);
}

export async function addDummyAssets() {
  const saves = dummyAssetsData.Assets.map(async (item) => {
    const newAsset = dsm.create(Asset, item);
    await dsm.save(Asset, newAsset).catch((e) => console.log(e));
  });
  await Promise.all(saves);
}

export async function addDummyContent() {
  const data = {
    name: "Image Gallery 1",
    columns: 1,
    asset: await dsm.find(Asset),
  };
  const content = dsm.create(Content, data);
  await dsm.find(Asset).catch((e) => console.log(e));
  await dsm.save(Content, content);
}

export async function updateDummyPortfolioItems() {
  const data = {
    content: await dsm.find(Content),
  };
  const portfolioItems = await dsm.find(PortfolioItem);
  const saves = portfolioItems.map(async (item) => {
    item.content = data.content;
    await dsm.save(item);
  });
  await Promise.all(saves);
}

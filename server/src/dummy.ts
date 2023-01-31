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
        name: "Garanti Bank | Basket",
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
        name: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
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
  const data = [
    {
      name: "Garanti | Image Gallery",
      columns: 1,
      asset: await dsm.find(Asset),
    },
    {
      name: "Anadolu Insurance | Image Gallery",
      columns: 2,
      asset: await dsm.find(Asset),
    },
  ];
  const saves = data.map(async (item) => {
    const newItem = dsm.create(Content, item);
    await dsm.save(Content, newItem).catch((e) => console.log(e));
  });

  await Promise.all(saves);
}

export async function updateDummyPortfolioItems() {
  const data = await dsm.find(Content);
  const portfolioItems = await dsm.find(PortfolioItem);
  const saves = portfolioItems.map(async (item, index) => {
    // note: if item.content is legit (not undefined or null) then we can use spread operator : [...item.content, data[index]]
    item.content = [data[index]];
    await dsm.save(item);
  });
  await Promise.all(saves);
}

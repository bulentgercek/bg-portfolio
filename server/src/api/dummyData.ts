import { ds, dsm } from "../connections";
import { Asset, AssetType } from "../entities/Asset";
import { Content } from "../entities/Content";
import { Portfolio } from "../entities/Portfolio";
import { PortfolioCategory } from "../entities/PortfolioCategory";
import { PortfolioItem } from "../entities/PortfolioItem";

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
  const entities = [Portfolio, Asset];
  for (const entity of entities) {
    await ds.createQueryBuilder().delete().from(entity).execute();
  }
}

export async function addDummyPortfolio() {
  const portfolio = dsm.create(Portfolio, dummyPortfolioData);
  await dsm.save(Portfolio, portfolio);
}

export async function addDummyPortfolioCategories() {
  const data: Record<string, unknown> = {
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
    const newPortfolioItem: Record<string, unknown> = dsm.create(
      PortfolioItem,
      item,
    );
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
  // Add First Content
  const portfolioItemGaranti = await dsm.findOne(PortfolioItem, {
    where: {
      name: "Garanti Bank | Basket",
    },
  });

  if (portfolioItemGaranti instanceof PortfolioItem) {
    const content = dsm.create(Content, {
      name: "Garanti | Image Gallery",
      columns: 1,
      asset: await dsm.find(Asset),
      portfolioItem: portfolioItemGaranti,
    });
    await dsm.save(Content, content);
  }
  // Add Second Content
  const portfolioItemAnadolu = await dsm.findOne(PortfolioItem, {
    where: {
      name: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
    },
  });

  if (portfolioItemAnadolu instanceof PortfolioItem) {
    const content = dsm.create(Content, {
      name: "Anadolu | Image Gallery",
      columns: 1,
      asset: await dsm.find(Asset),
      portfolioItem: portfolioItemAnadolu,
    });
    await dsm.save(Content, content);
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDummyContent = exports.addDummyAssets = exports.addDummyPortfolioItems = exports.addDummyPortfolioCategories = exports.addDummyPortfolio = exports.cleanAllEntities = void 0;
const connections_1 = require("../connections");
const Asset_1 = require("../entities/Asset");
const Content_1 = require("../entities/Content");
const Portfolio_1 = require("../entities/Portfolio");
const PortfolioCategory_1 = require("../entities/PortfolioCategory");
const PortfolioItem_1 = require("../entities/PortfolioItem");
const dummyAssetsData = {
    Assets: [
        {
            name: "Logo",
            type: Asset_1.AssetType.Image,
            url: "https://example.com/logo.jpg",
        },
        {
            name: "Featured",
            type: Asset_1.AssetType.Image,
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
async function cleanAllEntities() {
    const entities = [Portfolio_1.Portfolio, Asset_1.Asset];
    for (const entity of entities) {
        await connections_1.ds.createQueryBuilder().delete().from(entity).execute();
    }
}
exports.cleanAllEntities = cleanAllEntities;
async function addDummyPortfolio() {
    const portfolio = connections_1.dsm.create(Portfolio_1.Portfolio, dummyPortfolioData);
    await connections_1.dsm.save(Portfolio_1.Portfolio, portfolio);
}
exports.addDummyPortfolio = addDummyPortfolio;
async function addDummyPortfolioCategories() {
    const data = {
        name: "Printed Media",
        itemsOrder: [1, 2],
        portfolio: await connections_1.dsm.findOneBy(Portfolio_1.Portfolio, {
            name: "BG Portfolio",
        }),
    };
    const category = connections_1.dsm.create(PortfolioCategory_1.PortfolioCategory, data);
    await connections_1.dsm.save(PortfolioCategory_1.PortfolioCategory, category);
}
exports.addDummyPortfolioCategories = addDummyPortfolioCategories;
// Add Dummy Datas
async function addDummyPortfolioItems() {
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
                portfolioCategory: await connections_1.dsm.find(PortfolioCategory_1.PortfolioCategory, {
                    where: {
                        name: "Printed Media",
                    },
                }),
                portfolio: await connections_1.dsm.findOneBy(Portfolio_1.Portfolio, {
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
                portfolioCategory: await connections_1.dsm.find(PortfolioCategory_1.PortfolioCategory, {
                    where: {
                        name: "Printed Media",
                    },
                }),
                portfolio: await connections_1.dsm.findOneBy(Portfolio_1.Portfolio, {
                    name: "BG Portfolio",
                }),
            },
        ],
    };
    const saves = data.PortfolioItems.map(async (item) => {
        const newPortfolioItem = connections_1.dsm.create(PortfolioItem_1.PortfolioItem, item);
        await connections_1.dsm.save(PortfolioItem_1.PortfolioItem, newPortfolioItem);
    });
    await Promise.all(saves);
}
exports.addDummyPortfolioItems = addDummyPortfolioItems;
async function addDummyAssets() {
    const saves = dummyAssetsData.Assets.map(async (item) => {
        const newAsset = connections_1.dsm.create(Asset_1.Asset, item);
        await connections_1.dsm.save(Asset_1.Asset, newAsset).catch((e) => console.log(e));
    });
    await Promise.all(saves);
}
exports.addDummyAssets = addDummyAssets;
async function addDummyContent() {
    // Add First Content
    const portfolioItemGaranti = await connections_1.dsm.findOne(PortfolioItem_1.PortfolioItem, {
        where: {
            name: "Garanti Bank | Basket",
        },
    });
    if (portfolioItemGaranti instanceof PortfolioItem_1.PortfolioItem) {
        const content = connections_1.dsm.create(Content_1.Content, {
            name: "Garanti | Image Gallery",
            columns: 1,
            asset: await connections_1.dsm.find(Asset_1.Asset),
            portfolioItem: portfolioItemGaranti,
        });
        await connections_1.dsm.save(Content_1.Content, content);
    }
    // Add Second Content
    const portfolioItemAnadolu = await connections_1.dsm.findOne(PortfolioItem_1.PortfolioItem, {
        where: {
            name: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
        },
    });
    if (portfolioItemAnadolu instanceof PortfolioItem_1.PortfolioItem) {
        const content = connections_1.dsm.create(Content_1.Content, {
            name: "Anadolu | Image Gallery",
            columns: 1,
            asset: await connections_1.dsm.find(Asset_1.Asset),
            portfolioItem: portfolioItemAnadolu,
        });
        await connections_1.dsm.save(Content_1.Content, content);
    }
}
exports.addDummyContent = addDummyContent;

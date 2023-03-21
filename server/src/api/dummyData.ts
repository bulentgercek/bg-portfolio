// import { ds, dsm } from "../connections";
// import { Asset, AssetType } from "../entities/Asset";
// import { Content, ContentType } from "../entities/Content";
// import { User, UserType } from "../entities/User";
// import { Category } from "../entities/Category";
// import { Item } from "../entities/Item";

// const dummyAssetsData = {
//   Assets: [
//     {
//       name: "Logo",
//       type: AssetType.Image,
//       url: "https://example.com/logo.jpg",
//     },
//     {
//       name: "Featured",
//       type: AssetType.Image,
//       url: "https://example.com/image.jpg",
//     },
//     {
//       name: "Text",
//       type: AssetType.Text,
//       text: "My name is <b>Bulent</b>.",
//     },
//   ],
// };

// const dummyUserData = {
//   name: "Bulent Gercek",
// };

// // Delete Dummy Datas
// export async function cleanAllEntities() {
//   // const entities = [Item, Asset];
//   // for (const entity of entities) {
//   //   await ds.createQueryBuilder().delete().from(entity).execute();
//   // }
// }

// export async function addDummyUser() {
//   const user = dsm.create(User, dummyUserData);
//   await dsm.save(User, user);
// }

// export async function addDummyCategories() {
//   const data: Record<string, unknown> = {
//     name: "Printed Media",
//   };
//   const category = dsm.create(Category, data);
//   await dsm.save(Category, category);
// }

// // Add Dummy Items
// export async function addDummyItems() {
//   const data = {
//     Items: [
//       {
//         name: "Garanti Bank | Basket",
//         description: `<b>Agency</b> : Alametifarika
// Date : 2011
// Medium : Poster and Magazine Announcement
// Technic : 3D Modeling
// Summary : Garanti Bank 3D illustrations for posters and magazine advertisements`,
//         categories: await dsm.find(Category, {
//           where: {
//             name: "Printed Media",
//           },
//         }),
//       },
//       {
//         name: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
//         description: `<b>Agency</b>: TBWA
// Date: 2012
// Mecra: Poster
// Technique: 3D Modeling
// Abstract: Poster illustrations prepared for Anadolu Insurance`,
//         category: await dsm.find(Category, {
//           where: {
//             name: "Printed Media",
//           },
//         }),
//       },
//     ],
//   };

//   const saves = data.Items.map(async (item) => {
//     const newItem: Item = dsm.create(Item, item);
//     await dsm.save(Item, newItem);
//   });
//   await Promise.all(saves);
// }

// export async function addDummyAssets() {
//   const saves = dummyAssetsData.Assets.map(async (item) => {
//     const newAsset = dsm.create(Asset, item);
//     await dsm.save(Asset, newAsset).catch((e) => console.log(e));
//   });
//   await Promise.all(saves);
// }

// export async function addDummyContents() {
//   // Add First Content
//   const itemGaranti = await dsm.findOne(Item, {
//     where: {
//       name: "Garanti Bank | Basket",
//     },
//   });

//   if (itemGaranti instanceof Item) {
//     const content = dsm.create(Content, {
//       name: "Garanti | Image Gallery",
//       type: ContentType.ImageGalleryMasonary,
//       assets: await dsm.find(Asset),
//       item: itemGaranti,
//     });
//     await dsm.save(Content, content);
//   }
//   // Add Second Content
//   const itemAnadolu = await dsm.findOne(Item, {
//     where: {
//       name: "Anadolu Insurance | Fire Campaign Posters with 3D Images",
//     },
//   });

//   if (itemAnadolu instanceof Item) {
//     const content = dsm.create(Content, {
//       name: "Anadolu | Image Gallery",
//       type: ContentType.ImageGalleryMasonary,
//       assets: await dsm.find(Asset),
//       item: itemAnadolu,
//     });
//     await dsm.save(Content, content);
//   }
// }

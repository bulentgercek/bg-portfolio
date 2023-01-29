import { DataSource } from "typeorm";
import { Asset } from "./entity/Asset";

export async function getAssets(ds: DataSource) {
  return await ds.manager.find(Asset);
}

export async function addAsset(ds: DataSource, asset: Asset) {
  return await ds.manager.save(asset);
}

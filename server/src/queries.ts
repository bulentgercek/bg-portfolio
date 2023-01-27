import { DataSource } from "typeorm";
import { Media } from "./entity/Media";

export async function getAllMedia(ds: DataSource): Promise<Media[]> {
  return await ds.manager.find(Media);
}

export async function addMedia(ds: DataSource, media: Media): Promise<Media> {
  return await ds.manager.save(media);
}

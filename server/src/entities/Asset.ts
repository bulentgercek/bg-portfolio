import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "./Content";

export enum AssetType {
  Image = "image",
  Video = "video",
}

@Entity({ name: "assets" })
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: AssetType, default: AssetType.Image })
  type: AssetType;

  @Column()
  url: string;

  @ManyToMany(() => Content, (content) => content.asset)
  content: Content[];
}

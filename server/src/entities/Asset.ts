import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Content } from "./Content";

export enum AssetType {
  Image = "image",
  Video = "video",
  Text = "text",
  Pdf = "pdf",
}

@Entity({ name: "assets" })
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Asset" })
  name: string;

  @Column({
    type: "enum",
    enum: AssetType,
    default: AssetType.Image,
  })
  type: AssetType;

  @Column({ type: "text", nullable: true })
  text: string;

  @Column({ nullable: true })
  url: string;

  @ManyToMany(() => Content, (content) => content.assets, { nullable: true })
  contents: Content[];

  @UpdateDateColumn()
  updatedDate: Date;
}

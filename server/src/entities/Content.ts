import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { Asset } from "./Asset";
import { Item } from "./Item";

export enum ContentType {
  TextBlock = "textBlock",
  ImageGalleryMasonry = "imageGalleryMasonry",
  VideoGallery = "videoGallery",
}

@Entity({ name: "contents" })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Content" })
  name: string;

  @Column({
    type: "enum",
    enum: ContentType,
    default: ContentType.TextBlock,
  })
  type: ContentType;

  @Column({ default: 1 })
  columns: number;

  @ManyToOne(() => Item, (item) => item.contents, {
    nullable: false,
    onDelete: "CASCADE",
  })
  item: Item;

  @ManyToMany(() => Asset, (asset) => asset.contents, { nullable: true })
  @JoinTable()
  assets: Asset[];

  @Column({ default: 0 })
  orderId: number;
}

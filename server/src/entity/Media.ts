import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Content } from "./Content";

export enum MediaType {
  Image = "image",
  Video = "video",
}

@Entity({ name: "media" })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  columns: number;

  @Column({ type: "enum", enum: MediaType, default: MediaType.Image })
  type: MediaType;

  @Column()
  url: string;

  @ManyToMany((type) => Content, (content) => content.media)
  content: Content[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Media } from "./Media";

@Entity({ name: "contents" })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  columns: number;

  @ManyToMany((type) => Media, (media) => media.content)
  media: Media[];
}

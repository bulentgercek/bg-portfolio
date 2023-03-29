import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Content } from "./Content";
import { Category } from "./Category";
import { Asset } from "./Asset";

@Entity({ name: "items" })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Item" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  featured: boolean;

  @OneToOne(() => Asset, { nullable: true })
  @JoinColumn()
  featuredImageAsset: Asset;

  @ManyToMany(() => Category, (category) => category.items, { nullable: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Content, (content) => content.item, { nullable: true })
  contents: Content[];

  @UpdateDateColumn()
  updatedDate: Date;
}

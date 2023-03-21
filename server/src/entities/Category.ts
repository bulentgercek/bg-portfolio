import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { Item } from "./Item";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Category", nullable: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToMany(() => Item, (item) => item.categories, { nullable: true })
  items: Item[];

  @ManyToMany(() => Category, (category) => category.parentCategories, {
    nullable: true,
  })
  @JoinTable()
  parentCategories: Category[];

  @Column("simple-array", { nullable: true })
  childCategoriesOrder: number[];

  @Column("simple-array", { nullable: true })
  itemsOrder: number[];
}
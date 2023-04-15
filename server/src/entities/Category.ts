import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Item } from "./Item";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Category" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToMany(() => Item, (item) => item.categories, { nullable: true })
  items: Item[];

  @ManyToOne(() => Category, (category) => category.childCategories, {
    nullable: true,
  })
  parentCategory: Category | null;

  @OneToMany(() => Category, (category) => category.parentCategory, {
    nullable: true,
  })
  childCategories: Category[];

  @Column("simple-array", { nullable: true })
  childCategoriesOrder: number[];

  @Column("simple-array", { nullable: true })
  itemsOrder: number[];
}

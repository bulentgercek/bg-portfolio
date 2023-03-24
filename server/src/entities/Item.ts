import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Content } from "./Content";
import { Category } from "./Category";

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

  @ManyToMany(() => Category, (category) => category.items, { nullable: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Content, (content) => content.item, { nullable: true })
  contents: Content[];

  @UpdateDateColumn()
  updatedDate: Date;
}

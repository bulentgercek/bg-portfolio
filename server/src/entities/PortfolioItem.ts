import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Content } from "./Content";
import { Portfolio } from "./Portfolio";
import { PortfolioCategory } from "./PortfolioCategory";

@Entity({ name: "portfolio_items" })
export class PortfolioItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(
    () => PortfolioCategory,
    (portfolioCategory) => portfolioCategory.portfolioItem,
  )
  @JoinTable()
  portfolioCategory: PortfolioCategory[];

  @OneToMany(() => Content, (content) => content.portfolioItem)
  content: Content[];

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioItem, {
    nullable: false,
    onDelete: "CASCADE",
  })
  portfolio: Portfolio;
}

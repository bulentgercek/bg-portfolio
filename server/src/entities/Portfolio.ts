import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PortfolioCategory } from "./PortfolioCategory";
import { PortfolioItem } from "./PortfolioItem";

@Entity({ name: "portfolios" })
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("simple-array", { nullable: true })
  categoriesOrder: number[];

  @Column("simple-array", { nullable: true })
  itemsOrder: number[];

  @OneToMany(
    () => PortfolioCategory,
    (portfolioCategory) => portfolioCategory.portfolio,
  )
  portfolioCategory: PortfolioCategory[];

  @OneToMany(() => PortfolioItem, (portfolioItem) => portfolioItem.portfolio)
  portfolioItem: PortfolioItem[];
}

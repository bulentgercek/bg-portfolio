import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Portfolio } from "./Portfolio";
import { PortfolioItem } from "./PortfolioItem";

@Entity({ name: "portfolio_categories" })
export class PortfolioCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("simple-array")
  itemsOrder: number[];

  @ManyToMany(() => PortfolioItem, (portfolioItem) => portfolioItem.portfolioCategory)
  @JoinTable()
  portfolioItem: PortfolioItem[];

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioCategory)
  portfolio: Portfolio;
}

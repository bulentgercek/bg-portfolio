import {
  Column,
  Entity,
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

  @Column("simple-array", { nullable: true })
  itemsOrder: number[];

  @ManyToMany(
    () => PortfolioItem,
    (portfolioItem) => portfolioItem.portfolioCategory,
  )
  portfolioItem: PortfolioItem[];

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioCategory, {
    nullable: false,
    onDelete: "CASCADE",
  })
  portfolio: Portfolio;
}

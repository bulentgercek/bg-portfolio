import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { Asset } from "./Asset";
import { PortfolioItem } from "./PortfolioItem";

@Entity({ name: "contents" })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  columns: number;

  @ManyToOne(() => PortfolioItem, (portfolioItem) => portfolioItem.content)
  portfolioItem: PortfolioItem;

  @ManyToMany(() => Asset, (asset) => asset.content)
  @JoinTable()
  asset: Asset[];
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum OptionCategory {
  System = "system",
  Category = "category",
  Item = "item",
  Content = "content",
  Asset = "asset",
}

export enum OptionType {
  Boolean = "boolean",
  String = "string",
  Number = "number",
}

@Entity({ name: "options" })
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled Option" })
  name: string;

  @Column({
    type: "enum",
    enum: OptionCategory,
    default: OptionCategory.System,
  })
  category: OptionCategory;

  @Column({
    type: "enum",
    enum: OptionType,
    default: OptionType.Boolean,
  })
  type: OptionType;

  @Column({ type: "text", nullable: true })
  value: string;
}

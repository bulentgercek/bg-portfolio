import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

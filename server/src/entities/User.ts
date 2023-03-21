import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserType {
  Admin = "admin",
  Editor = "editor",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "Untitled User" })
  name: string;

  @Column({ type: "enum", enum: UserType, default: UserType.Admin })
  type: UserType;

  @Column({ nullable: true })
  password: string;

  @UpdateDateColumn()
  updatedDate: Date;
}

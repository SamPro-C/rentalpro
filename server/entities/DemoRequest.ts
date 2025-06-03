import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("demo_requests")
export class DemoRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  email!: string;

  @Column("text")
  phone!: string;

  @Column("text", { name: "user_type" })
  userType!: string;

  @Column("text", { nullable: true })
  message?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

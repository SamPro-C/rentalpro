import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true })
  username!: string;

  @Column("varchar", { unique: true })
  email!: string;

  @Column("varchar")
  password!: string;

  @Column("varchar")
  role!: string; // admin, landlord, tenant, shop_manager, worker

  @Column("varchar")
  fullName!: string;

  @Column("varchar", { nullable: true })
  phone?: string;

  @Column("boolean", { default: false })
  isApproved!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

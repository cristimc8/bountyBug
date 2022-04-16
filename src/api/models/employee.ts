import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@/api/models/role";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @ManyToOne(() => Role, {
    cascade: true,
    eager: true
  })
  role: Role;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@/api/models/role";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hash: string;

  @ManyToOne(() => Role, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  })
  role: Role;
}

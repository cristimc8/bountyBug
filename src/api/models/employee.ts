import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@/api/models/role";
import { Bug } from "@/api/models/bug";

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

  @OneToMany(() => Bug, bug => bug.assignee)
  assignedBugs: Bug[];

  @OneToMany(() => Bug, bug => bug.creator)
  createdBugs: Bug[];
}

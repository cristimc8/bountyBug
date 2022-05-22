import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AvailabilityStatusEnum } from "@/interfaces/IStatus";
import { ImportanceEnum } from "@/interfaces/IImportance";
import { Employee } from "@/api/models/employee";

@Entity()
export class Bug {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  name: string;

  @Column()
  description: string;

  @Column({
    type: "enum",
    enum: AvailabilityStatusEnum,
    default: AvailabilityStatusEnum.Available,
  })
  status: AvailabilityStatusEnum;

  @Column({
    type: "enum",
    enum: ImportanceEnum,
    default: ImportanceEnum.Minor,
  })
  importance: ImportanceEnum;

  @ManyToOne(() => Employee, employee => employee.assignedBugs, {
    eager: true,
    onDelete: "CASCADE"
  })
  assignee?: Employee;

  @ManyToOne(() => Employee, employee => employee.createdBugs, {
    eager: true,
    onDelete: "CASCADE"
  })
  creator: Employee;
}

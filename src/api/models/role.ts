import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleEnum } from "@/interfaces/IRole";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.Programmer
  })
  name: RoleEnum;
}

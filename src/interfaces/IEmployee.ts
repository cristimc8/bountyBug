import { Role } from "@/api/models/role";
import { RoleEnum } from "@/interfaces/IRole";

export interface IEmployee {
  id: number;
  username: string;
  role: RoleEnum;
}
export interface IEmployeeInputDTO {
  username: string;
  password: string;
  role: RoleEnum
}

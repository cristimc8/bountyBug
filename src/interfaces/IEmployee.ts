import { RoleEnum } from "@/interfaces/IRole";

export interface IEmployee {
  _id: number;
  username: string;
  password: string;
}
export interface IEmployeeInputDTO {
  username: string;
  password: string;
  role: RoleEnum
}

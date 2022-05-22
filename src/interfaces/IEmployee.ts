import { RoleEnum } from "@/interfaces/IRole";

export interface IEmployee {
  id: number;
  username: string;
  role: RoleEnum;
}

export interface IEmployeeInputDTO {
  id: number;
  username: string;
  password: string;
  role: RoleEnum
}

export interface IEmployeeResponse {
  id: number;
  username: string;
  role: RoleEnum;
}

import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { Employee } from "@/api/models/employee";
import { AppDataSource } from "@/data-source";
import { IEmployeeInputDTO, IEmployeeResponse } from "@/interfaces/IEmployee";
import { Role } from "@/api/models/role";
import { randomBytes } from "crypto";
import argon2 from "argon2";

@Service()
export default class EmployeesHandler {
  private employeeRepo: Repository<Employee>;
  private roleRepo: Repository<Role>;

  constructor(
      @Inject('logger') private logger
  ) {
    this.employeeRepo = AppDataSource.getRepository(Employee);
    this.roleRepo = AppDataSource.getRepository(Role);
  }

  public async list(): Promise<IEmployeeResponse[]> {
    return (await this.employeeRepo.find())
        .map(EmployeesHandler.mapToEmployeeResponse);
  }

  public async update(employee: IEmployeeInputDTO): Promise<void> {
    const upEmployee = await this.employeeRepo.findOneBy({ id: employee.id });
    upEmployee.role = await this.roleRepo.findOneBy({ name: employee.role });
    if ((upEmployee.username !== employee.username) &&
        await this.employeeRepo.findOneBy({ username: employee.username }) !== null) {
      throw new Error('This username is already assigned!');
    }
    upEmployee.username = employee.username;
    if (employee.password !== '') {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(employee.password, { salt });
      upEmployee.hash = hashedPassword;
      upEmployee.salt = salt.toString('hex');
    }
    await this.employeeRepo.update(
        upEmployee.id,
        upEmployee
    );
  }

  public async delete(id: number): Promise<void> {
    const employee = await this.employeeRepo.findOneBy({ id });
    if(!employee) {
      throw new Error('Employee does not exist!');
    }
    await this.employeeRepo.remove([employee]);
  }

  public static mapToEmployeeResponse(
      employee: Employee
  ): IEmployeeResponse {
    return {
      id: employee.id,
      role: employee.role.name,
      username: employee.username
    };
  }
}

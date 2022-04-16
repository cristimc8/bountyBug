import { Inject, Service } from "typedi";
import { EventDispatcher, EventDispatcherInterface } from "@/decorators/eventDispatcher";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from "@/config";
import { IEmployee, IEmployeeInputDTO } from "@/interfaces/IEmployee";
import { AppDataSource } from "@/data-source";
import { Employee } from "@/api/models/employee";
import { Role } from "@/api/models/role";

@Service()
export default class AuthHandler {
  private employeeRepo;

  constructor(
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
      @Inject('logger') private logger
  ) {
    this.employeeRepo = AppDataSource.getRepository(Employee);
  }

  public async signUp(employeeInputDTO: IEmployeeInputDTO): Promise<{ employee: IEmployee; token: string }> {
    try {
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(employeeInputDTO.password);

      this.logger.silly('Creating employee db record');
      const employee = new Employee();
      const role = new Role();
      role.name = employeeInputDTO.role;
      employee.role = role;
      employee.hash = hashedPassword;
      employee.username = employeeInputDTO.username;

      const employeeRecord: Employee = await this.employeeRepo.save(employee);
      this.logger.silly('Employee created');

      this.logger.silly('Generating JWT');
      const token = this.generateToken(employeeRecord);

      const employeeRecordToReturn = {
        _id: employeeRecord.id,
        username: employeeRecord.username,
        role: employeeRecord.role.name
      }
      return {employee: employeeRecordToReturn, token};
    } catch (e) {
      this.logger.error(e);
    }
  }

  private generateToken(employee: Employee) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${employee.id}`);
    return jwt.sign(
        {
          _id: employee.id,
          role: employee.role.name,
          username: employee.username,
          exp: exp.getTime() / 1000,
        },
        config.jwtSecret
    );
  }
}

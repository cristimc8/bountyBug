import { Inject, Service } from "typedi";
import { EventDispatcher, EventDispatcherInterface } from "@/decorators/eventDispatcher";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from "@/config";
import { IEmployee, IEmployeeInputDTO } from "@/interfaces/IEmployee";
import { AppDataSource } from "@/data-source";
import { Employee } from "@/api/models/employee";
import { Role } from "@/api/models/role";
import { randomBytes } from "crypto";
import { Repository } from "typeorm";

@Service()
export default class AuthHandler {
  private employeeRepo: Repository<Employee>;
  private roleRepo: Repository<Role>;

  constructor(
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
      @Inject('logger') private logger
  ) {
    this.employeeRepo = AppDataSource.getRepository(Employee);
    this.roleRepo = AppDataSource.getRepository(Role);
  }

  public async signUp(employeeInputDTO: IEmployeeInputDTO): Promise<{ employee: IEmployee; token: string }> {
    try {
      const salt = randomBytes(32);
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(employeeInputDTO.password, { salt });

      this.logger.silly('Creating employee db record');
      const employee = new Employee();
      employee.role = await this.roleRepo.findOneBy({ name: employeeInputDTO.role });
      employee.hash = hashedPassword;
      employee.username = employeeInputDTO.username;
      employee.salt = salt.toString('hex');

      const employeeRecord: Employee = await this.employeeRepo.save(employee);
      this.logger.silly('Employee created');

      this.logger.silly('Generating JWT');
      const token = this.generateToken(employeeRecord);

      const employeeRecordToReturn = {
        id: employeeRecord.id,
        username: employeeRecord.username,
        role: employeeRecord.role.name
      };
      return { employee: employeeRecordToReturn, token };
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async signIn(employeeInputDTO: Partial<IEmployeeInputDTO>): Promise<{ employee: IEmployee, token: string }> {
    const employeeRecord = await this.employeeRepo.findOneBy({ username: employeeInputDTO.username });
    console.log(employeeRecord)
    if (!employeeRecord) {
      throw new Error('No employee found with this username!');
    }
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(employeeRecord.hash, employeeInputDTO.password);

    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const jwt = this.generateToken(employeeRecord);

      const employeeRecordToReturn = {
        id: employeeRecord.id,
        username: employeeRecord.username,
        role: employeeRecord.role.name
      };

      return { employee: employeeRecordToReturn, token: jwt };

    } else {
      throw new Error('Invalid Password');
    }

  }

  private generateToken(employee: Employee) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${employee.id}`);
    return jwt.sign(
        {
          id: employee.id,
          role: employee.role.name,
          username: employee.username,
          exp: exp.getTime() / 1000,
        },
        config.jwtSecret
    );
  }
}

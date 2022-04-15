import { Inject, Service } from "typedi";
import { EventDispatcher, EventDispatcherInterface } from "@/decorators/eventDispatcher";
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import config from "@/config";
import { IEmployee, IEmployeeInputDTO } from "@/interfaces/IEmployee";

@Service()
export default class AuthHandler {
  constructor(
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
      @Inject('logger') private logger
  ) {
  }

  public signUp(employeeInputDTO: IEmployeeInputDTO): Promise<{ employee: IEmployee; token: string }> {
    try {

    }

  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
        {
          _id: user._id, // We are gonna use this in the middleware 'isAuth'
          role: user.role,
          name: user.name,
          exp: exp.getTime() / 1000,
        },
        config.jwtSecret
    );
  }
}

import { Container } from 'typedi';
import LoggerInstance from './logger';
import AuthHandler from "@/services/auth/authHandler";
import BugsHandler from "@/services/bugs/bugsHandler";
import EmployeesHandler from "@/services/users/employeesHandler";

export default () => {
    Container.set('logger', LoggerInstance);
    Container.set('AuthHandler', AuthHandler);
    Container.set('BugsHandler', BugsHandler);
    Container.set('EmployeesHandler', EmployeesHandler);
};

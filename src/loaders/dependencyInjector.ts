import { Container } from 'typedi';
import LoggerInstance from './logger';
import AuthHandler from "@/services/auth/authHandler";

export default () => {
    Container.set('logger', LoggerInstance);
    Container.set('AuthHandler', AuthHandler);
};

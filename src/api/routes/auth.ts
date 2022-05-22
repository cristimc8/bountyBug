import { Router } from "express";
import { isAdmin, isAuthenticated } from "@/api/middleware/authentication";
import { Container } from "typedi";
import AuthHandler from "@/services/auth/authHandler";
import { IEmployeeInputDTO } from "@/interfaces/IEmployee";
import logger from "@/loaders/logger";
import { mapInputEntities } from "@/api/middleware/mappers";

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
      '/signup',
      mapInputEntities,
      isAuthenticated,
      isAdmin,
      async (req, res, next) => {
        try {
          const authServiceInstance = Container.get(AuthHandler);
          const { employee, token } = await authServiceInstance.signUp(req.body as IEmployeeInputDTO);
          return res.sendStatus(201);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      });

  route.post(
      '/authenticate',
      async (req, res, next) => {
        try {
          const { username, password } = req.body;
          const authServiceInstance = Container.get(AuthHandler);
          const { employee, token } = await authServiceInstance.signIn({ username, password });
          return res.status(200).json({ employee, token });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      });
}

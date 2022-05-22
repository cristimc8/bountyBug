import { Router } from "express";
import { isAdmin, isAuthenticated } from "@/api/middleware/authentication";
import logger from "@/loaders/logger";
import { Container } from "typedi";
import EmployeesHandler from "@/services/users/employeesHandler";
import { IEmployeeInputDTO } from "@/interfaces/IEmployee";

const route = Router();

export default (app: Router) => {
  app.use('/employees', route);

  route.get(
      '/',
      isAuthenticated,
      isAdmin,
      async (req, res, next) => {
        try {
          const employeesHandler = Container.get(EmployeesHandler);
          return res
              .status(200)
              .json({
                employees: await employeesHandler.list()
              });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.put(
      '/:id',
      isAuthenticated,
      isAdmin,
      async (req, res, next) => {
        try {
          const employeesHandler = Container.get(EmployeesHandler);
          await employeesHandler.update({ ...req.body, id: Number(req.params.id) } as IEmployeeInputDTO);
          return res.sendStatus(200);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.delete(
      '/:id',
      isAuthenticated,
      isAdmin,
      async (req, res, next) => {
        try {
          console.log(req.params.id)
          const employeesHandler = Container.get(EmployeesHandler);
          await employeesHandler.delete(Number(req.params.id));
          return res.sendStatus(200);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );
}

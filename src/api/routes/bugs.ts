import logger from "@/loaders/logger";
import { Router } from "express";
import { Container } from "typedi";
import BugsHandler from "@/services/bugs/bugsHandler";
import { Bug } from "@/api/models/bug";
import { IBugAssigningRequest, IBugCreateRequest, IBugResponse, IBugUpdateRequest } from "@/interfaces/IBug";
import { isAuthenticated } from "@/api/middleware/authentication";

const route = Router();

export default (app: Router) => {
  app.use('/bugs', route);

  route.get(
      '/list',
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          return res
              .status(200)
              .json({ bugs: await bugsServiceInstance.list() });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.post(
      '/',
      isAuthenticated,
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          const bug: IBugResponse = await bugsServiceInstance.create(req.body as IBugCreateRequest);
          return res
              .status(201)
              .json({ bug });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.patch(
      '/assign',
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          await bugsServiceInstance.assign(req.body as IBugAssigningRequest);
          return res.sendStatus(200);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.patch(
      '/deassign',
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          await bugsServiceInstance.deAssign(req.body as IBugAssigningRequest);
          return res.sendStatus(200);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.patch(
      '/complete',
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          await bugsServiceInstance.markCompleted(req.body as IBugAssigningRequest);
          return res.sendStatus(200);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );

  route.put(
      '/:id',
      isAuthenticated,
      async (req, res, next) => {
        try {
          const bugsServiceInstance = Container.get(BugsHandler);
          const bug: IBugResponse = await bugsServiceInstance.update({
            ...req.body,
            id: Number(req.params.id)
          } as IBugUpdateRequest);
          return res
              .status(200)
              .json({ bug });
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
  );
}

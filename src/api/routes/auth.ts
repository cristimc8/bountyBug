import { Router } from "express";
import { isAdmin } from "@/api/middleware/authentication";

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/create', isAdmin, async (req, res, next) => {

  })
}

import jwt from "jsonwebtoken";
import config from "@/config";
import { RoleEnum } from "@/interfaces/IRole";

export const isAdmin = (req, res, next) => {
  if(req.employee.role !== RoleEnum.Admin) {
    return res.status(403).json({ error: "You need to be authenticated as an admin to access this resource" });
  }
  next();
}

export const isAuthenticated = (req, res, next) => {
  const authorizationHeader = req.header('authorization');
  console.log(req.header('authorization'))
  const token = parseBearer(authorizationHeader);
  if(!token || token.length === 0) {
    return res.status(403).json({ error: "You need to be authenticated in order to access this resource" });
  }
  try {
    req.employee = jwt.verify(token, config.jwtSecret);
    next();
  } catch (error: any) {
    console.error(error);
    return res.status(409).json({ error: "You need to be authenticated in order to access this resource" });
  }
}

const parseBearer = (bearer?: string) => {
  if(!bearer) return;
  const [_, token] = bearer.trim().split(" ");
  return token;
};


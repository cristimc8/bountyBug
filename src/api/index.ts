import { Router } from 'express';
import auth from './routes/auth';
import bugs from "@/api/routes/bugs";
import employees from "@/api/routes/employees";
// import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  bugs(app);
  employees(app);

  return app
}

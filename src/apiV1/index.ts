import { Router } from "express";
import auth from "./auth/auth.route";
import users from "./users/user.route";

const router: Router = Router();

router.use("/env", (req, res) => {
  res.json(process.env);
});
router.use("/", auth);
router.use("/users", users);

export default router;

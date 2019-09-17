import { Router } from "express";
import auth from "./auth/auth.route";
import users from "./users/user.route";
import books from "./books/books.route";

const router: Router = Router();

router.use("/env", (req, res) => {
  res.json(process.env);
});
router.use("/", auth);
router.use("/users", users);
router.use("/books", books);


export default router;

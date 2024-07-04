import { Router } from "express";
import jetValidator from "jet-validator";

import Paths from "../common/Paths";
import User from "@src/models/User";
import Book from "@src/models/Book";
import UserRoutes from "./UserRoutes";
import BookRoutes from "./BookRoutes";

// **** Variables **** //

const apiRouter = Router(),
	validate = jetValidator();

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

// Add one user
userRouter.post(
	Paths.Users.Add,
	validate(["user", User.isUser]),
	UserRoutes.add
);

// Update one user
userRouter.put(
	Paths.Users.Update,
	validate(["user", User.isUser]),
	UserRoutes.update
);

// Delete one user
userRouter.delete(
	Paths.Users.Delete,
	validate(["id", "number", "params"]),
	UserRoutes.delete
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);


// ** Add BookRouter ** //
const bookRouter = Router();

// Get all books
bookRouter.get(Paths.Books.Get, BookRoutes.getAll);

// Add one book
bookRouter.post(
	Paths.Books.Add,
	validate(["book", Book.isBook]),
	BookRoutes.add
);

// Update one book
bookRouter.put(
	Paths.Books.Update,
	validate(["book", Book.isBook]),
	BookRoutes.update
);

// Delete one book
bookRouter.delete(
	Paths.Books.Delete,
	validate(["id", "number", "params"]),
	BookRoutes.delete
);

// Add BookRouter
apiRouter.use(Paths.Books.Base, bookRouter);

// **** Export default **** //

export default apiRouter;

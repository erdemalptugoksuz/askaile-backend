import express from "express";

import {
  createUser,
  loginUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticationMiddleware } from "../middleware";

const userRoutes = express.Router();

userRoutes.route("/signup").post(createUser);
userRoutes.route("/signin").post(loginUser);
userRoutes.route("/:id").delete(authenticationMiddleware, deleteUser);

export default userRoutes;

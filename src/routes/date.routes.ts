import express from "express";

import { createNewDate, getAllDates } from "../controllers/date.controller";
import { authenticationMiddleware } from "../middleware";

const dateRoutes = express.Router();
dateRoutes.use(authenticationMiddleware);

dateRoutes.route("/create").post(createNewDate);
dateRoutes.route("/").get(getAllDates);

export default dateRoutes;

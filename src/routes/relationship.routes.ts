import express from "express";

import {
  createRelationship,
  deleteRelationship,
} from "../controllers/relationship.controller";
import { authenticationMiddleware } from "../middleware";

const relationshipRoutes = express.Router();
relationshipRoutes.use(authenticationMiddleware);

relationshipRoutes.route("/create").post(createRelationship);
relationshipRoutes.route("/delete/:id").delete(deleteRelationship);

export default relationshipRoutes;

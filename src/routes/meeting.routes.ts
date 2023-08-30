import express from "express";

import {
  createNewMeeting,
  getAllMeetings,
} from "../controllers/meeting.controller";
import { authenticationMiddleware } from "../middleware";

const meetingRoutes = express.Router();
meetingRoutes.use(authenticationMiddleware);

meetingRoutes.route("/create").post(createNewMeeting);
meetingRoutes.route("/").get(getAllMeetings);

export default meetingRoutes;

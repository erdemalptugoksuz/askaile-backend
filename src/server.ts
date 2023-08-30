import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";

import connectToDatabase from "./db";
import userRoutes from "./routes/user.routes";
import relationshipRoutes from "./routes/relationship.routes";
import meetingRoutes from "./routes/meeting.routes";

const application = express();
application.use(express.json());
application.use(cors());
const PORT = process.env.PORT || 3000;

connectToDatabase();

application.get("/lovebombing", (request: Request, response: Response) => {
  response.send("Seni çok seviyorum yamurum 😻");
});

application.use("/users", userRoutes);
application.use("/relationships", relationshipRoutes);
application.use("/meetings", meetingRoutes);

application.listen(PORT, () => {
  console.log(`Server up and running`);
});

// #TODO: Bütün controllerlara update işlevi ekle.
// #TODO: Meeting controllerına delete işlevi ekle.

import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";

import connectToDatabase from "./db";
import userRoutes from "./routes/user.routes";
import relationshipRoutes from "./routes/relationship.routes";
import dateRoutes from "./routes/date.routes";

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
application.use("/dates", dateRoutes);

application.listen(PORT, () => {
  console.log(`Server up and running`);
});

// #TODO: Relationship silinirken date'lerin de silinmesi gerekiyor.
// #TODO: Date'in ismini değiştir.
// #TODO: Bütün controllerlara update işlevi ekle.
// #TODO: Date controllerına delete işlevi ekle.

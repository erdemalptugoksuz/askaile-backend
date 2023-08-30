import { Response } from "express";

import Relationship from "../models/relationshipModel";
import Date from "../models/dateModel";
import { IDate } from "../types";
import { AuthRequest } from "../middleware";

export const createNewDate = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const user = request.user;
    const { dateTime, place, description, budget, budgetCurrency }: IDate =
      request.body;

    const relationship = await Relationship.findOne({
      partners: { $in: [user] },
    });

    if (!dateTime) {
      return response
        .status(400)
        .send("Some credentials are missing! Try again...");
    } else if (!relationship) {
      return response.status(404).send("Relationship not found! Try again...");
    }

    const date = await Date.create({
      dateTime: dateTime,
      place: place,
      description: description,
      budget: budget,
      budgetCurrency: budgetCurrency,
      relationship: relationship._id,
    });

    relationship.dates.push(date._id);

    await Promise.all([relationship.save()]);

    return response.status(201).json({ message: "Date created successfully!" });
  } catch (error) {
    if (error.name === "CastError") {
      return response
        .status(400)
        .send("Invalid relationshipId format! Please check your input.");
    }
    response.send({ error: "Something went wrong" });
    console.log("Error in createNewDate controller!", error);
    throw error;
  }
};

export const getAllDates = async (request: AuthRequest, response: Response) => {
  try {
    const userId = request.user;
    const relationship = await Relationship.findOne({
      partners: { $in: [userId] },
    });

    const dates = await Date.find({
      relationship: relationship._id,
    });
    response.send(dates);
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
    console.log("Error in getAllDates controller!", error);
    throw error;
  }
};

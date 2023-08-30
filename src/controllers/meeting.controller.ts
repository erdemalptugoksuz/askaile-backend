import { Response } from "express";

import Relationship from "../models/relationshipModel";
import Meeting from "../models/meetingModel";
import { IMeeting } from "../types";
import { AuthRequest } from "../middleware";

export const createNewMeeting = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const user = request.user;
    const {
      meetingTime,
      place,
      description,
      budget,
      budgetCurrency,
    }: IMeeting = request.body;

    const relationship = await Relationship.findOne({
      partners: { $in: [user] },
    });

    if (!meetingTime) {
      return response
        .status(400)
        .send("Some credentials are missing! Try again...");
    } else if (!relationship) {
      return response.status(404).send("Relationship not found! Try again...");
    }

    const meeting = await Meeting.create({
      meetingTime: meetingTime,
      place: place,
      description: description,
      budget: budget,
      budgetCurrency: budgetCurrency,
      relationship: relationship._id,
    });

    relationship.meetings.push(meeting._id);

    await Promise.all([relationship.save()]);

    return response
      .status(201)
      .json({ message: "Meeting created successfully!" });
  } catch (error) {
    if (error.name === "CastError") {
      return response
        .status(400)
        .send("Invalid relationshipId format! Please check your input.");
    }
    response.send({ error: "Something went wrong" });
    console.log("Error in createNewMeeting controller!", error);
    throw error;
  }
};

export const getAllMeetings = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const relationship = await Relationship.findOne({
      partners: { $in: [userId] },
    });

    const meetings = await Meeting.find({
      relationship: relationship._id,
    });
    response.send(meetings);
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
    console.log("Error in getAllMeetings controller!", error);
    throw error;
  }
};

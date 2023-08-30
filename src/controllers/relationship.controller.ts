import { Response } from "express";

import User from "../models/userModel";
import Relationship from "../models/relationshipModel";
import { Types } from "mongoose";
import { IRelationship } from "../types";
import { AuthRequest } from "../middleware";
import Meeting from "../models/meetingModel";

export const createRelationship = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = request.user;
    const { partnerId, startDate, status }: IRelationship = request.body;

    const user = await User.findById(userId);
    const partner = await User.findById(partnerId);

    if (!userId || !partnerId || !startDate || !status) {
      return response
        .status(400)
        .send("Some credentials are missing! Try again...");
    } else if (!user) {
      return response.status(404).send("User not found! Try again...");
    } else if (!partner) {
      return response.status(404).send("Partner not found! Try again...");
    } else if (user._id.toString() === partner._id.toString()) {
      return response
        .status(400)
        .send("User cannot create relationship with themselves! Try again...");
    } else if (user.relationship || partner.relationship) {
      return response
        .status(400)
        .send("User or partner already has a relationship! Try again...");
    }

    const relationship = await Relationship.create({
      startDate,
      status,
      partners: [user._id, partner._id],
    });

    user.relationship = relationship._id;
    partner.relationship = relationship._id;

    await Promise.all([user.save(), partner.save()]);

    return response
      .status(201)
      .json({ message: "Relationship created successfully!" });
  } catch (error) {
    if (error.name === "CastError") {
      return response
        .status(400)
        .send("Invalid User ID or Partner ID format! Please check your input.");
    }
    response.send({ error: "Something went wrong" });
    console.log("Error in createRelationship controller!", error);
    throw error;
  }
};

export const deleteRelationship = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const userId = new Types.ObjectId(request.user);
    const { id } = request.params;

    if (!Types.ObjectId.isValid(id)) {
      return response
        .status(400)
        .send("Relationship ID is not valid! Try again...");
    }

    const relationship = await Relationship.findById(id);
    if (!relationship) {
      return response.status(404).send("Relationship not found! Try again...");
    }

    if (relationship.partners.includes(userId)) {
      const deletedRelationship = await Relationship.findByIdAndDelete(id);

      if (deletedRelationship) {
        await Meeting.deleteMany({ relationship: id });
        const user = await User.findById(deletedRelationship.partners[0]);
        const partner = await User.findById(deletedRelationship.partners[1]);
        if (user && partner) {
          user.relationship = undefined;
          partner.relationship = undefined;

          await Promise.all([user.save(), partner.save()]);
        }

        return response.status(200).send("Relationship deleted successfully!");
      }
    } else {
      return response
        .status(403)
        .send("You don't have permission to delete this relationship!");
    }
  } catch (error) {
    response.send({ error: "Something went wrong" });
    console.log("Error in deleteRelationship controller!", error);
    throw error;
  }
};

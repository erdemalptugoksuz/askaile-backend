import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import User from "../models/userModel";
import { IUser } from "../types";
import { AuthRequest } from "../middleware";

const getUserToken = (_id: string | Types.ObjectId) => {
  const authenticatedUserToken = jwt.sign({ _id }, "express", {
    expiresIn: "7d",
  });
  return authenticatedUserToken;
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const {
      name,
      lastName,
      gender,
      email,
      password,
      birthDate,
      livingPlace,
    }: IUser = request.body;

    const existingUser = await User.findOne({ email });
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password && password.length >= 6;

    if (
      !name ||
      !lastName ||
      !gender ||
      !email ||
      !password ||
      !birthDate ||
      !livingPlace
    ) {
      return response
        .status(400)
        .send("Some credentials are missing! Try again...");
    } else if (existingUser) {
      return response
        .status(409)
        .send("This email is already in use! Try different one...");
    } else if (!isEmailValid) {
      return response
        .status(400)
        .send("This email is not valid! Check again...");
    } else if (!isPasswordValid) {
      return response
        .status(400)
        .send("Password is too short! 6 characters minimum...");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name,
      lastName: lastName,
      gender: gender,
      email: email,
      password: hashedPassword,
      birthDate: birthDate,
      livingPlace: livingPlace,
    });

    if (!newUser) {
      return response
        .status(500)
        .send("User creation failed! Please try again later...");
    }

    return response.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    response.send({ error: "Something went wrong" });
    console.log("Error in createUser controller!", error);
    throw error;
  }
};

export const loginUser = async (request: Request, response: Response) => {
  try {
    const { email, password }: IUser = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .send("Email or password is missing! Try again...");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return response
        .status(409)
        .send({ message: "This email doesn't match any user! Try again..." });
    }

    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordIdentical) {
      const token = getUserToken(existingUser._id);
      return response.send({
        token,
        user: {
          email: existingUser.email,
        },
      });
    } else {
      return response
        .status(400)
        .send({ message: "Wrong credentials... Try again..." });
    }
  } catch (error) {
    response.send({ error: "Something went wrong" });
    console.log("Error in loginUser controller!", error);
    throw error;
  }
};

export const deleteUser = async (request: AuthRequest, response: Response) => {
  try {
    const user = request.user;
    const { id } = request.params;

    if (!id) {
      return response.status(400).send("User ID is missing! Try again...");
    } else if (!Types.ObjectId.isValid(id)) {
      return response.status(400).send("User ID is not valid! Try again...");
    } else if (user !== id) {
      return response
        .status(401)
        .send("You are not authorized to delete this user!");
    }

    const deletedUser = await User.deleteOne({ _id: id });

    if (!deletedUser) {
      return response
        .status(409)
        .send("This user doesn't exist! Try different one...");
    }

    return response.status(200).send("User deleted successfully!");
  } catch (error) {
    response.send({ error: "Something went wrong" });
    console.log("Error in deleteUser controller!", error);
    throw error;
  }
};

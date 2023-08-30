import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/userModel";

export interface AuthRequest extends Request {
  user: string;
}

export const authenticationMiddleware = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      return response.status(401).json({
        error: "Authorization is required! Please sign in to get access.",
      });
    }

    const token = authorization;
    const { _id } = jwt.verify(token, "express") as JwtPayload;
    const existingUser = await User.findOne({ _id });

    if (existingUser) {
      request.user = existingUser.id;
    }
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return response
        .status(401)
        .json({ error: "Token expired! Please sign in again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return response
        .status(401)
        .json({ error: "Invalid token! Please try again." });
    } else {
      return response
        .status(500)
        .json({ error: "Server error! Please try again." });
    }
  }
};

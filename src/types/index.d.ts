import { Types } from "mongoose";

export interface IRelationship {
  _id: string;
  startDate: string;
  status: string;
  userId: Types.ObjectId;
  partnerId: Types.ObjectId;
}

export interface IUser {
  name: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  birthDate: string;
  livingPlace: string;
}

export interface IDate {
  _id: string;
  dateTime: string;
  place: string;
  description: string;
  budget: number;
  budgetCurrency: string;
  relationshipId: Types.ObjectId;
}

import { Schema, model } from "mongoose";
import { BASE_RECORD_STATES, USER_ROLES } from "../../../constants/constants";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already taken"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    roles: {
      type: [String],
      enum: [USER_ROLES],
      default: [USER_ROLES.STUDENT],
    },
    status: {
      type: String,
      enum: BASE_RECORD_STATES,
      default: BASE_RECORD_STATES.ACTIVE,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);

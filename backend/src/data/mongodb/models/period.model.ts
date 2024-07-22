import { Schema, model } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

const periodSchema = new Schema(
  {
    code: {
      type: String,
      unique: [true, "Code must be unique"],
      required: [true, "Code is required"],
    },
    status: {
      type: String,
      enum: BASE_RECORD_STATES,
      default: BASE_RECORD_STATES.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const PeriodModel = model("Period", periodSchema);

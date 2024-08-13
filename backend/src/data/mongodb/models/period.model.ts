import { model, Schema, Types } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

const periodSchema = new Schema(
  {
    code: {
      type: String,
      unique: [true, "Code must be unique"],
      required: [true, "Code is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: BASE_RECORD_STATES,
      default: BASE_RECORD_STATES.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PeriodModel = model("Period", periodSchema);

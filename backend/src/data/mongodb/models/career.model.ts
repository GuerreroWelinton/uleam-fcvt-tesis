import { model, Schema } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

const CareerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
    },
    numberOfLevels: {
      type: Number,
      required: [true, "Number of levels is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    status: {
      type: String,
      enum: [BASE_RECORD_STATES],
      default: BASE_RECORD_STATES.ACTIVE,
    },
  },
  { timestamps: true }
);

export const CareerModel = model("Career", CareerSchema);

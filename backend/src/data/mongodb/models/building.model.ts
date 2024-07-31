import { Schema, model } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

const BuildingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    numberOfFloors: {
      type: Number,
      required: [true, "Number of floors is required"],
    },
    status: {
      type: String,
      enum: BASE_RECORD_STATES,
      default: BASE_RECORD_STATES.ACTIVE,
    },
    periodId: {
      type: Schema.Types.ObjectId,
      ref: "Period",
      // required: [true, "Period is required"],
    },
  },
  { timestamps: true }
);

export const BuildingModel = model("Building", BuildingSchema);

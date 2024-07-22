import { model, Schema } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

export const SubjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
    },
    academicLevel: {
      type: Number,
      required: [true, "Academic level is required"],
    },
    careerId: {
      type: Schema.Types.ObjectId,
      ref: "Career",
      required: [true, "Career is required"],
    },
    status: {
      type: String,
      enum: BASE_RECORD_STATES,
      default: BASE_RECORD_STATES.ACTIVE,
    },
  },
  { timestamps: true }
);

export const SubjectModel = model("Subject", SubjectSchema);

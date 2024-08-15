import { model, Schema } from "mongoose";
import { BASE_RECORD_STATES } from "../../../constants/constants";

const fileUpload = new Schema(
  {
    originalName: {
      type: String,
      required: [true, "Name is required"],
    },
    path: {
      type: String,
      required: [true, "Path is required"],
    },
    mimetype: {
      type: String,
      required: [true, "Mimetype is required"],
    },
    size: {
      type: Number,
      required: [true, "Size is required"],
    },
    recordId: {
      type: String,
      required: [true, "Record id asociated is required"],
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
  {
    timestamps: true,
  }
);

export const FileUploadModel = model("File-Upload", fileUpload);

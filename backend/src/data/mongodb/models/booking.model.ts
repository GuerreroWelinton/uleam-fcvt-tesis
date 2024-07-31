import { model, Schema } from "mongoose";
import { BOOKING_STATES } from "../../../constants/constants";

export const BookingSchema = new Schema(
  {
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
    },
    observation: {
      type: String,
      required: [true, "Observation is required"],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    eduSpaceId: {
      type: Schema.Types.ObjectId,
      ref: "Educational-Space",
      required: [true, "Educational space is required"],
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },
    participants: {
      type: [
        {
          name: {
            type: String,
            required: [true, "Name is required"],
          },
          attended: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: [true, "Participants are required"],
    },
    status: {
      type: String,
      enum: BOOKING_STATES,
      default: BOOKING_STATES.PENDING,
    },
    periodId: {
      type: Schema.Types.ObjectId,
      ref: "Period",
      // required: [true, "Period is required"],
    },
  },
  { timestamps: true }
);

export const BookingModel = model("Booking", BookingSchema);

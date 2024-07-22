import mongoose from "mongoose";
import { BASE_RECORD_STATES, DAY_OF_WEEK } from "../../../constants/constants";

const HoursOfOperationSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: Object.values(DAY_OF_WEEK),
    required: [true, "Day of week is required"],
  },
  startTime: {
    type: String,
    match: /^(closed|^([0-1][0-9]|2[0-3]):([0-5][0-9]))$/,
    required: [true, "Start is required"],
  },
  endTime: {
    type: String,
    match: /^(closed|^([0-1][0-9]|2[0-3]):([0-5][0-9]))$/,
    required: [true, "End is required"],
  },
});

const EducationalSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
    },
    floor: {
      type: Number,
      required: [true, "Floor is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    hoursOfOperation: {
      type: [HoursOfOperationSchema],
      required: [true, "Hours operation is required"],
    },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: [true, "Building is required"],
    },
    userId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: [true, "User is required"],
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

// BuildingSchema.pre("save", async function (next) {
//   const building = this;
//   if (!building.hoursOperation.length) {
//     return next(
//       new Error(
//         "Hours operation is required. Building must have at least one HoursOperation object."
//       )
//     );
//   }
//   next();
// });

export const EducationalSpaceModel = mongoose.model(
  "Educational-Space",
  EducationalSpaceSchema
);

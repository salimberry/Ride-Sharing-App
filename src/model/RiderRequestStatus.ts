import mongoose from "mongoose";

export interface RiderRequestAttributes {
  rideId: string,
  rider: string;
  status: boolean;
}

const riderRequestSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
 },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
      },
    },
    timestamps: true,
  }
);

const RiderRequestStatus = mongoose.model<RiderRequestAttributes>(
  "Rider",
  riderRequestSchema
);

export default RiderRequestStatus;

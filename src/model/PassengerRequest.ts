import mongoose from "mongoose";

export interface PassengerRequestAttributes {
  _id: string;
  passengerId: string;
  pickupLocation: string;
  destination: string;
  departureTime: Date;
  amount: string;
  status: string
}

const PassengerRequest = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: {
      type: Date,
      required: true,
      default: new Date(Date.now()),
    },
    amount: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
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


const passengerRequest = mongoose.model<PassengerRequestAttributes>("Passenger", PassengerRequest)
export default passengerRequest;
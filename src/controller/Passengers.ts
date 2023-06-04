import express, { Request, Response } from "express";
import passengerRequest from "../model/PassengerRequest";
import RiderRequestStatus from "../model/RiderRequestStatus";
import User from "../model/User";
import Users from "../model/User";

/**BOOK RIDE */

export const bookRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { pickupLocation, destination, amount } = req.body;

    const user = await Users.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ Error: "Kindly create an account to book a ride" });
    }

    const rideRequest = await passengerRequest.create({
      passengerId: id,
      pickupLocation,
      destination,
      amount,
    });

    return res.status(201).json({
      message: "You've successfully booked a ride",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /book-ride",
      error,
    });
  }
};

/**CANCEL RIDE */

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await passengerRequest.findByIdAndDelete(id);

    if (!ride) {
      return res.status(400).json({
        Error: "Your cancel request was not completed",
      });
    }
    return res.status(201).json({
      message: "Your request has been canceled",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /cancel-ride",
      error,
    });
  }
};

/**VIEW COMPLETED RIDES ,*/

export const viewCompletedRides = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        error: "Kindly create an account to access this route",
      });
    }

    const completedRides = await passengerRequest.find({
      passengerId: user._id,
      status: "completed",
    });

    const rideDetailsPromises = completedRides.map(async (ride) => {
      const riderRequestStatus = await RiderRequestStatus.findOne({
        rideId: ride._id,
      });
      return {
        ride,
        rider: await User.findById(riderRequestStatus?.rider),
      };
    });

    const completedRidesWithRiderDetails = await Promise.all(
      rideDetailsPromises
    );

    return res.status(200).json({
      message: "Successfully fetched completed rides",
      completedRides: completedRidesWithRiderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error /completed-rides",
    });
  }
};

/**VIEW RIDE HISTORY ,*/
export const viewRideHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        Error: "Kindly create an account to access this route",
      });
    }

    const rideHistory = await passengerRequest.find({
      passengerId: user._id,
    });
      
     const rideDetailsPromises = rideHistory.map(async (ride) => {
       const riderRequestStatus = await RiderRequestStatus.findOne({
         rideId: ride._id,
       });
       return {
         ride,
         rider: await User.findById(riderRequestStatus?.rider),
       };
     });

     const completedRidesWithRiderDetails = await Promise.all(
       rideDetailsPromises
     );

     return res.status(200).json({
       message: "Successfully fetched rides history",
       completedRides: completedRidesWithRiderDetails,
     });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /completed-rides",
      error,
    });
  }
};


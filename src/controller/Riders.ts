import { Response, Request } from "express";
import passengerRequest from "../model/PassengerRequest";
import RiderRequestStatus from "../model/RiderRequestStatus";
import User from "../model/User";
import Users from "../model/User";

/**ACCEPT REQUEST */

export const AcceptOrRejectRequest = async (req: Request, res: Response) => {
  try {
    const { riderId } = req.params;
    const { requestId, status } = req.body;

    const rider = await Users.findById(riderId);
    if (!rider) {
      return res
        .status(400)
        .json({ Error: "Kindly create an account to become a rider" });
    }
      const validRequest = await passengerRequest.findById(requestId)
      if (!validRequest) {
        return res
          .status(400)
          .json({ Error: "Invalid request details" });
      }
         const rideStatus = await RiderRequestStatus.create({
           rideId: requestId,
           rider: riderId,
           status,
         });
      
      if (status === "accepted") {
          const updateFields = { status: "accepted" };

          const accepted = await passengerRequest.findByIdAndUpdate(
            {
              _id: requestId,
            },
            { $set: updateFields }
          );
          if (!accepted) {
             return res.status(404).json({
               message: "Error in updating rider request",
             });
          }
          const modifiedRequest = await passengerRequest.findById(requestId);
    
          return res.status(201).json({
            message: "Request successfully accepted",
            modifiedRequest,
          });
      }
   
      return res.status(200).json({
          message: "You rejected this request"
      })
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /completed-rides",
      error,
    });
  }
};



/**VIEW ALL HIS RIDES */

export const viewAllRides = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        Error: "Kindly create an account to access this route",
      });
    }
    const rideHistory = await RiderRequestStatus.find({
      rider: user._id,
    });

    const rideDetailsPromises = rideHistory.map(async (ride) => {
      const requestDetails = await passengerRequest.findOne({
        _id: ride._id,
      });
      return {
        ride,
        passengerDetails: requestDetails,
      };
    });

    const allRides = await Promise.all(
      rideDetailsPromises
    );

    return res.status(200).json({
      message: "Successfully fetched rides history",
      rides: allRides,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /completed-rides",
      error,
    });
  }
};


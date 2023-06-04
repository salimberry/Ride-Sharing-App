import express from "express";
import { bookRide, cancelRide, viewCompletedRides, viewRideHistory } from "../controller/Passengers";

const router = express.Router();

router.get("/get-history/:id", viewRideHistory)
router.get("/get-rides/:id", viewCompletedRides)
router.post("/book/:id", bookRide);
router.delete("/cancel/:id", cancelRide)


export default router;

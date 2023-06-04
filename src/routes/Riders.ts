import express from "express";
import { AcceptOrRejectRequest, viewAllRides } from "../controller/Riders";

const router = express.Router();


router.get("/get-rides/:id", viewAllRides)
router.post("/toggle-request/:riderId", AcceptOrRejectRequest)



export default router;
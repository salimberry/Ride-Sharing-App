import express from "express";
import {
  createUser,
    deleteUser,
    Login,
  getUsers,
  getSingleUser,
    updateUser,
} from "../controller/User";

const router = express.Router();

router.get("/get-users", getUsers);
router.get("/get-user/:id", getSingleUser);
router.post("/login", Login);
router.post("/create", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;

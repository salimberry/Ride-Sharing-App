import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, phone, role } = req.body;
    //check if User exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        Error: "User already exist, use different credentials",
      });
    }

    const userPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: userPassword,
      address,
      phone,
      role,
    });
    const savedUser = await User.findOne({ email });

    return res.status(201).json({
      message: "User Successfully registered",
      savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /create",
      error,
    });
  }
};

//LOGIN USER

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        Error: "Invalid credentials",
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        Error: "Invalid credentials.",
      });
    }

    return res.status(200).json({
      message: "Your login attempt was successful",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "An error occured in the user login",
      error,
    });
  }
};

/* GET ALL USERS*/

export const getUsers = async (req: Request, res: Response) => {
  try {
    const Users = await User.find({});
    const count = await User.countDocuments();
    
    res.status(201).json({ Users, count });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error /get-all-Users",
      error,
    });
  }
};

/* GET SINGLE USER*/

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({
        Error: "User not found in our records",
      });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server error /get-singleUser",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await User.findByIdAndDelete(id);

    return res.status(204).json({
      message: "User successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /deleteUser",
      error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, address, phone, role } = req.body;

    const updateFields = { name, email, password, address, phone, role };

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const modifiedUser = await User.findById(id);

    return res.status(201).json({
      message: "User successfully updated",
      modifiedUser,
    });
  } catch (error) {
    return res.status(500).json({
      Error: "Internal server error /updateUser",
      error,
    });
  }
};

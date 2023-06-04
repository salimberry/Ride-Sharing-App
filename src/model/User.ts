import mongoose, { Schema } from "mongoose";

interface UserInstance {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role: string;
  verified: boolean;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    role: { type: String, enum: ["rider", "passenger"], required: true },
        verified: { type: Boolean, required: true, default: false },
    
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

const Users = mongoose.model<UserInstance>("User", userSchema);

export default Users;


import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      maxlenght: 10,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      maxlenght: 6,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

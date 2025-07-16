import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";
import generateToken from "../utils/generateToken.js";

//we have to create two things register , login

//register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({ message: "user already existed" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Register Error ", error);
    res.status(500).json({ message: "server Error" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid person" });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Login error ", error);
    res.status(500).json({ message: "server error" });
  }
};

import bcrypt from "bcryptjs";
import crypot from "crypto";
import { sendEmail } from "../config/emailConfig.js";
import { User } from "../models/user.models.js";
import generateToken from "../utils/generateToken.js";

// Register controller
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

//forgot password with email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    //i have to create a reset token
    const resetToken = crypot.randomBytes(32).toString("hex");

    //hash token and set expiry (10 min)
    user.resetPasswordToken = crypot
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    //create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    //send email
    const emailTemplate = emailTemplate.passwordReset(resetURL, user.name);
    const emailResult = await sendEmail(user.email, emailTemplate);

    if (!emailResult.success) {
      //if email fails, clean up the token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "failed to send reset email. Please try again",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset request",
    });
  }
};

//reset password

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    //Hash the incoming token

    const hashedToken = crypot.createHash("sha256").update(token).digest("hex");

    //find user with vaild token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: DataTransfer.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update user password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: false,
      message:
        "Password reset successful. You can now login with your new password",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error during password reset",
    });
  }
};

export { forgotPassword, login, register, resetPassword };

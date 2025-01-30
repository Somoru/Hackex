import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, index: true }, // Add Index
    email: { type: String, unique: true, required: true, index: true }, // Add Index
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    hasPaid: { type: Boolean, default: false },
  });

export default mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" }
});

const User = mongoose.model("User", UserSchema);
export default User;

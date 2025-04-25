import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  hasPaid: { type: Boolean, default: true },
  paymentStatus: { type: String, deafult: "SUCCESS"}
});

const User = mongoose.model("User", UserSchema);
export default User;

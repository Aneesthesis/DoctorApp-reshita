import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  speciality: {
    type: String,
    required: true,
  },
  contactInfo: { type: String, required: true, unique: true },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

export const User = mongoose.model("User", userSchema);

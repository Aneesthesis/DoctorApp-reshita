import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    isDeactivated: { type: Boolean, required: true, default: false },

    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    medicalHistory: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Patient = mongoose.model("Patient", patientSchema);

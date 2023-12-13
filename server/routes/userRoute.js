import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import express from "express";
import { User } from "../models/UserModel.js";
import { formatFullName, generateAuthToken, isAuth } from "../helper.js";
import { Patient } from "../models/PatientModel.js";

export const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  res.send("Hello, Welcome to Doctor App by Anees");
});

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email }).populate(
      "patients"
    );
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          speciality: user.speciality,
          contactInfo: user.contactInfo,
          patients: user.patients,
          token: generateAuthToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      res
        .status(400)
        .send({ message: "Doctor already exists with this email" });
    } else {
      const newUser = new User({
        fullName: formatFullName(req.body.fullName),
        email: req.body.email,
        speciality: req.body.speciality,
        contactInfo: req.body.contactInfo,
        password: bcrypt.hashSync(req.body.password),
      });

      const user = await newUser.save();

      res.send({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        speciality: user.speciality,
        contactInfo: user.contactInfo,
        patients: user.patients,
        token: generateAuthToken(user),
      });
    }
  })
);

userRouter.put(
  `/profile`,
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).populate("patients");

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.speciality = req.body.speciality || user.speciality;
      user.contactInfo = req.body.contactInfo || user.contactInfo;
      user.patients = user.patients;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        speciality: updatedUser.speciality,
        contactInfo: updatedUser.contactInfo,
        patients: updatedUser.patients,
        token: generateAuthToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: `Error updating doctor info` });
    }
  })
);

userRouter.post(
  "/patients/add",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const newPatient = new Patient({
        fullName: req.body.fullName,
        age: req.body.age,
        medicalHistory: req.body.medicalHistory,
      });

      await newPatient.save();

      user.patients.push(newPatient._id);

      await user.save();

      res.send(newPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

userRouter.get(
  "/patients/:patientId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.user;
      const { patientId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      const patientIndex = user.patients.indexOf(patientId);
      if (patientIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      res.send(patient);
    } catch (error) {
      console.error("Error getting patient:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  })
);

userRouter.put(
  "/patients/:patientId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.user;
      const { patientId } = req.params;
      const { updatedPatientData } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      const patientIndex = user.patients.indexOf(patientId);
      if (patientIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        {
          fullName: updatedPatientData.fullName,
          age: updatedPatientData.age,
          medicalHistory: updatedPatientData.medicalHistory,
        },
        { new: true }
      );

      user.patients[patientIndex] = updatedPatient;
      await user.save();

      res.send(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  })
);

userRouter.delete(
  "/patients/delete/:patientId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.user;
      const { patientId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const patientIndex = user.patients.indexOf(patientId);
      if (patientIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      user.patients.splice(patientIndex, 1);

      await user.save();

      res.send(patientId);
    } catch (error) {
      console.error("Error deleting patient:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  })
);

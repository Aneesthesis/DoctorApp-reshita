import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import express from "express";
import { User } from "../models/UserModel.js";
import { generateAuthToken, isAuth } from "../helper.js";

export const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  res.send("annes");
});

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          speciality: user.specialty,
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
        fullName: req.body.fullName,
        email: req.body.email,
        specialty: req.body.speciality,
        password: bcrypt.hashSync(req.body.password),
      });

      const user = await newUser.save();

      res.send({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        speciality: user.specialty,
        token: generateAuthToken(user),
      });
    }
  })
);

userRouter.put(
  `/profile`,
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.specialty = req.body.speciality || user.speciality;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        speciality: updatedUser.specialty,
        token: generateAuthToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: `Doctor not Found` });
    }
  })
);

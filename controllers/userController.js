import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModle from "../models/user.js";

const secret = "test";

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModle.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModle.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

     res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModle.findOne({ email });

    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });

    
    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const googleLogin = async (req, res) => {
  const { email} = req.body;

  try {
    const oldUser = await UserModle.findOne({ email });

    if (oldUser) {
      res.status(200).json({ result: oldUser, token });
    }

    const result = await UserModle.create({
      _id: sub,
      type: "user",
      userName: name,
      email: email,
      imageUrl: picture,
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });

    console.log(error);
  }
};
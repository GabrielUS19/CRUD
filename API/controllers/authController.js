import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import validator from "validator";
import { json } from "express";

const prisma = new PrismaClient();

const signup_post = async (req, res) => {
  const name = req.body.name?.trim() || "";
  const email = req.body.email?.toLowerCase().trim() || "";
  const password = req.body.password || "";
  const confirmPassword = req.body.confirmPassword || "";

  if (!name || !password || !email || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "This Email is invalid" });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Your password is so weak" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "The passwords aren't the same" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return res
      .status(400)
      .json({ message: "This Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name: name, email: email, password: hashedPassword },
  });

  res.status(200).json({ message: "successfully registered" });
};

const login_post = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim() || "";
  const password = req.body.password || "";

  if (!password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Email and/or password are invalids" });
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    return res
      .status(400)
      .json({ message: "Email and/or password are invalids" });
  }

  res.status(200).json({ message: `Welcome ${user.name}` });
};

const update_password_patch = async (req, res) => {
  const userID = parseInt(req.params.id, 10);

  const {
    oldPassword = "",
    newPassword = "",
    confirmNewPassword = "",
  } = req.body;

  if (isNaN(userID)) {
    return res.status(400), json({ message: "Invalid ID" });
  }

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "The passwords aren't the same" });
  }

  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({ message: "This password is so weak" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userID },
  });

  const validOldPassword = await bcrypt.compare(oldPassword, user.password);

  if (!validOldPassword) {
    return res.status(400).json({ message: "The old password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userID },
    data: { password: hashedPassword },
  });

  res.status(200).json({ message: "Password updated" });
};

export default {
  signup_post,
  login_post,
  update_password_patch,
};

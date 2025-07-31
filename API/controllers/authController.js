import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import validator from "validator";

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

export default {
  signup_post,
  login_post,
};

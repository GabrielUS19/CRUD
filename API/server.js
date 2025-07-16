import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Create User

app.post("/users", async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.replace(/\s/g, "");

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid Email format" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return res.status(400).json({ message: "This Email is already in use!" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "This password is so weak" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: hashPassword,
    },
  });

  res
    .status(201)
    .json({ message: "User created succesfuly", user: { name, email } });
});

// Login Route

app.post("/login", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.replace(/\s/g, "");

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  return res.status(200).json({ message: "Seja bem vindo" });
});

// Update User

// Delete Account

app.delete("/users", async (req, res) => {
  await prisma.user.delete({
    where: { email: "" },
  });

  res.send("Deleted");
});

app.listen(3000);

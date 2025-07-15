import express from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Create User

app.post("/users", async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.replace(/\s/g, "");

  if (!name || !email || !password) {
    return res.status(400).json("All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json("Invalid Email format");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return res.status(400).json(`This Email is already in use!`);
  }

  await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: password,
    },
  });

  res.status(201).json(`${name} Is now a user`);
});

// Update User

// Delete Account

app.delete("/users", async (req, res) => {
  await prisma.user.delete({
    where: { email: "" },
  });

  res.send("Deleted");
});

app.get("/users", async (req, res) => {
  const name = await prisma.user.findMany();
  res.send(name);
});

app.listen(3000);

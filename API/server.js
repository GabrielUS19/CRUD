import express from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    },
  });

  res.status(201).json(req.body);
});

app.delete("/users", async (req, res) => {
  await prisma.user.delete({
    where: { id: 4 },
  });

  res.send("Deleted");
});

app.get("/users", async (req, res) => {
  res.send(names);
});

app.listen(3000);

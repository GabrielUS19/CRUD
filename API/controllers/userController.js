import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Update the profile info by ID

const update_profile_patch = async (req, res) => {
  const userID = parseInt(req.params.id, 10);

  const newName = req.body.newName.trim() || "";

  if (!newName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(userID)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Search for the user in the database by ID

  const user = await prisma.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Update the user profile

  await prisma.user.update({
    where: { id: userID },
    data: { name: newName },
  });

  res.status(200).json({ message: "Username updated" });
};

// Route to delete the own account

const delete_account_delete = async (req, res) => {
  const userID = parseInt(req.params.id, 10);

  const password = req.body.password || "";

  if (!password) {
    return res
      .status(400)
      .json({ message: "The password field can't be empty" });
  }

  if (isNaN(userID)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  await prisma.user.delete({
    where: { id: userID },
  });

  res.status(200).json({ message: "Account deleted" });
};

export default {
  update_profile_patch,
  delete_account_delete,
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Update the profile info by ID

const update_patch = async (req, res) => {
  const userID = parseInt(req.params.id, 10);

  const newName = req.body.newName.trim() || "";

  if (!newName) {
    res.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(userID)) {
    res.status(400).json({ message: "Invalid ID format" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid ID" });
  }

  await prisma.user.update({
    where: { id: userID },
    data: { name: newName },
  });

  res.status(200).json({ message: "Username updated" });
};

export default {
  update_patch,
};

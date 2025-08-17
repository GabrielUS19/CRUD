import express from "express";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
app.use(express.json());

// Create User

app.use(authRoute);
app.use(userRoute);

// Error 404

app.use((req, res) => {
  res.status(404).json({ message: "Error 404: Page not found" });
});

app.listen(3000);

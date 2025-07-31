import express from "express";
import authRoute from "./routes/authRoute.js";

const app = express();
app.use(express.json());

// Create User

app.use(authRoute);

app.listen(3000);

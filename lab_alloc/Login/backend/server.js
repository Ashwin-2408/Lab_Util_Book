import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authroutes.js";
import User from "./models/User.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use authentication routes
app.use("/auth", authRoutes);

// Sync database models
sequelize.sync()
  .then(() => console.log("✅ Database synchronized"))
  .catch((err) => console.error("❌ Database sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

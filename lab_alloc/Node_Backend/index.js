import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Router from "./Routes/Main_route.js";
import sequelize from "./Schema/db_connection.js";
import Notification from "./Schema/Notification.js";
import notificationsRouter from "./Routes/notification_route.js";
import WaitListRouter from "./Routes/WaitList_Route.js";
import bulkRoutes from './Routes/bulk_routes.js';
import cron from "node-cron";
import { Op } from "sequelize";
import Allocation from "./Schema/Allocation.js";
import User from "./Schema/User.js";
import Resource from "./Schema/Resource.js";
import ResourceRequest from "./Schema/ResourceRequest.js";
import Lab from "./Schema/Lab.js";
import Auth from "./Schema/Auth.js";
import BulkResourceAvailability from "./Schema/BulkResourceAvailability.js";
import BulkRequest from "./Schema/BulkRequest.js";

// Import associations
import './Schema/associations.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(Router);
app.use("/notifications", notificationsRouter);
app.use("/waitlist", WaitListRouter);
app.use('/bulk', bulkRoutes);

// Remove setupAssociations() since we're importing associations directly

// Update the sync process to include force option for development
sequelize
  .sync() // force: true will drop and recreate tables
  .then(() => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Error initializing tables:", err);
  });


cron.schedule("* * * * *", async () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

  try {
    const upcomingSessions = await Notification.findAll({
      where: {
        timestamp: {
          [Op.between]: [now, fiveMinutesLater],
        },
        isRead: false,
      },      
    });

    if (upcomingSessions.length > 0) {
      console.log("Upcoming sessions within 5 minutes:", upcomingSessions);
    }
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
  }
});

app.listen(3001, (err) => {
  if (err) {
    console.log({ Err: "Server Failed" });
  }
  console.log("Server is listening on port 3001");
});
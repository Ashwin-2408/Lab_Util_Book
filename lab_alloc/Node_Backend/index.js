import express from "express";
import cors from "cors";
import Router from "./Routes/Main_route.js";
import sequelize from "./Schema/db_connection.js";
import Notification from "./Schema/Notification.js";
import notificationsRouter from "./Routes/notification_route.js";
import cron from "node-cron";
import { Op } from "sequelize";
import Allocation from "./Schema/Allocation.js";
import User from "./Schema/User.js";
import Resource from "./Schema/Resource.js";
import ResourceRequest from "./Schema/ResourceRequest.js";
import Lab from "./Schema/Lab.js";
import setupAssociations from "./Schema/Associations.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(Router);
app.use("/", notificationsRouter);

sequelize
  .sync({ alter: true }) 
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
        isRead: False,
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
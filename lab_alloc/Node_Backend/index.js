// filepath: /c:/Users/Abishek/Lab_Util_Book/lab_alloc/Node_Backend/index.js
import express from "express";
import cors from "cors";
import { Router } from "./Routes/Main_route.js";
import { sequelize } from "./Schema/db_connection.js";
import Notification from "./Schema/Notification.js";
import notificationsRouter from "./Routes/notification_route.js";
import cron from "node-cron";
import { Op } from "sequelize";

const app = express();
app.use(cors());
app.use(express.json());
app.use(Router);
app.use("/", notificationsRouter);

// Sync Database
sequelize.sync({ alter: true }).then(() => {
  console.log("Database & tables synced!");
});

// Schedule job to check for upcoming sessions every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

  try {
    const upcomingSessions = await Notification.findAll({
      where: {
        sessionStartTime: {
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
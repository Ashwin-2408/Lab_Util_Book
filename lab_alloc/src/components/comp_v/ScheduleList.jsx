import "./maintenance.css";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
export default function ScheduleList({ customSelect, mainData }) {
  function formatDate(date_elem) {
    const dateObj = new Date(date_elem);
    var dateString =
      dateObj.toLocaleDateString("en-US", { month: "short" }) +
      " " +
      dateObj.getDate() +
      ", " +
      dateObj.getFullYear();
    return dateString;
  }

  function formatTime(time24) {
    let [hours, minutes] = time24.split(":").map(Number);
    let suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }

  function session_status(startDate, startTime) {
    let currentDate = new Date();
    let eventDate = new Date(`${startDate}T${startTime}`);
    if (currentDate > eventDate) {
      return "completed";
    } else if (currentDate.toDateString() === eventDate.toDateString()) {
      return currentDate.getTime() > eventDate.getTime()
        ? "completed"
        : "ongoing";
    } else {
      return "upcoming";
    }
  }

  function matchLabId(value) {
    return customSelect[value].lab_name;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{ margin: "0rem 0.5rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            fontSize: "1.5rem",
            fontWeight: "400",
          }}
        >
          All Maintenance Schedules
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "400",
            color: " #6c757d",
          }}
        >
          View and manage all maintenance schedules
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            fontSize: "1.2rem",
            fontWeight: "500",
            marginTop: "2rem",
          }}
        >
          Scheduled Maintenance
        </div>
        <div></div>
      </div>
      <div>
        <table>
          <thead>
            <th>Lab</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Actions</th>
          </thead>
          {mainData.map((elem) => (
            <tr>
              <td style={{ fontWeight: "500" }}>{matchLabId(elem.lab_id)}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "40%" }}>
                    {formatDate(elem.start_date)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.3rem",
                      alignItems: "center",
                      color: "rgb(138, 138, 138)",
                    }}
                  >
                    <Clock style={{ width: "0.8rem" }} />
                    <div style={{ fontSize: "0.8rem" }}>
                      {formatTime(elem.start_time)}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "40%" }}>
                    {formatDate(elem.end_date)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.3rem",
                      alignItems: "center",
                      color: "rgb(138, 138, 138)",
                    }}
                  >
                    <Clock style={{ width: "0.8rem" }} />
                    <div style={{ fontSize: "0.8rem" }}>
                      {formatTime(elem.end_time)}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span
                  className={`main-span-status ${session_status(
                    elem.start_date,
                    elem.start_time
                  )}`}
                >
                  {session_status(elem.start_date, elem.start_time)}
                </span>
              </td>
              <td>
                <div>{elem.main_reason}</div>
              </td>
              <td>
                <div></div>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </motion.div>
  );
}

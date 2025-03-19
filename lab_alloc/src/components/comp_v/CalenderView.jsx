import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { motion } from "framer-motion";

export default function CalendarView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{ width: "100%", height: "100vh" }}
    >
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Maintenance", date: "2025-03-07" },
          { title: "Checkup", date: "2025-03-09" },
        ]}
        height="100%"
        contentHeight={300}
        dayCellContent={(arg) => (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            {arg.dayNumberText}
          </div>
        )}
      />
    </motion.div>
  );
}

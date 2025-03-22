import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Overview from "./Overview";
import KeyFeatures from "./KeyFeatures";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Dashboard(props) {
  const navigate = useNavigate();
  const [scheduleRequest, setScheduleRequest] = useState([]);
  const [pending, setPending] = useState(0);
  const [active, setActive] = useState(0);
  function handleNewSession() {
    navigate("/book");
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/cur_schedules")
      .then((response) => {
        setScheduleRequest(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log("Error", error));
  }, []);

  useEffect(() => {
    let pending_count = 0;
    let active_count = 0;
    scheduleRequest.map((elem, index) => {
      if (elem.status === "pending") {
        pending_count += 1;
      }

      if (elem.status === "approved") {
        active_count += 1;
      }
    });

    setActive(active_count);
    setPending(pending_count);
  }, [scheduleRequest]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="dashboard-sec-1">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            margin: "0.75rem 0rem",
          }}
        >
          Lab Utilization System
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontSize: "1.13rem",
            color: "#7b7b83",
            wordSpacing: "2px",
            fontWeight: "350",
            lineHeight: "1.5rem",
          }}
        >
          Streamline lab and resource management with our intuitive platform.
          Book labs, request resources, and manage your schedule efficiently.
        </motion.div>

        <motion.div
          className="book-btn"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: "flex", gap: "10px", marginTop: "1rem" }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "black",
              color: "white",
              textTransform: "none",
              width: "8rem",
              padding: "0.6rem 1rem",
            }}
            onClick={handleNewSession}
          >
            Book a Lab
          </Button>
          <Button
            variant="outlined"
            style={{
              borderColor: "rgb(188, 188, 188)",
              color: "black",
              textTransform: "none",
            }}
            // onClick={redirectresources}
          >
            Request Resources
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{ margin: "3rem 2rem" }}
      >
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              fontFamily: "Roboto",
              fontSize: "1.7rem",
              fontWeight: "900",
            }}
          >
            Dashboard Overview
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              fontFamily: "Roboto",
              fontSize: "1rem",
              fontWeight: "400",
              color: " #6c757d",
            }}
          >
            Current status and statistics of the lab utilization system.
          </motion.div>
          <div>
            <Overview
              active={active}
              pending={pending}
              totalLabs={props.totalLabs}
            />
          </div>
        </motion.div>
      </motion.div>
      <motion.div>
        <KeyFeatures setPageState={props.setPageState} />
      </motion.div>
    </motion.div>
  );
}

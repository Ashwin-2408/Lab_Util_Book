import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Overview from "./Overview";
import KeyFeatures from "./KeyFeatures";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();

  function handleNewSession() {
    navigate("/book");
  }
  function redirectresources() {
    navigate("/resource");
  }

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
            onClick={redirectresources}
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
            <Overview />
          </div>
        </motion.div>
      </motion.div>
      <motion.div>
        <KeyFeatures />
      </motion.div>
    </motion.div>
  );
}

import "./maintenance.css";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduleMain({ customSelect }) {
  const [refresh, setRefresh] = useState(true);
  const [formData, setFormData] = useState({
    lab_name: null,
    start_date: null,
    start_time: null,
    end_date: null,
    end_time: null,
    main_reason: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name != "--All--") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !formData.lab_name ||
      !formData.start_date ||
      !formData.start_time ||
      !formData.end_date ||
      !formData.end_time ||
      !formData.main_reason
    ) {
      alert("Please fill all the fields");
    }

    let data = new FormData();
    const username = "admin1";
    data.append("username", username);
    data.append("lab_name", formData.lab_name);
    data.append("start_date", formData.start_date);
    data.append("start_time", formData.start_time);
    data.append("end_date", formData.end_date);
    data.append("end_time", formData.end_time);
    data.append("main_reason", formData.main_reason);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/maintenance/create",
      data
    );
    if (response.status === 200) {
      setRefresh((prevState) => !prevState);
    } else {
      alert("Please Try Again");
    }
  }

  useEffect(() => {}, [refresh]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{
        fontFamily: "Roboto",
        display: "flex",
        gap: "1.4rem",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            fontSize: "1.5rem",
            fontWeight: "400",
          }}
        >
          Schedule New Maintenance
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "400",
            color: " #6c757d",
          }}
        >
          Create a new maintenance schedule by selecting a lab, setting the time
          period, and providing details.
        </div>
      </div>
      <form className="main-form">
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <div className="main-form-div">
            <label
              htmlFor="select-main-lab"
              style={{ fontSize: "0.9rem", fontWeight: "400" }}
            >
              Lab
            </label>
            <select
              name="lab_name"
              id="select-main-lab"
              onChange={handleChange}
            >
              {customSelect.map((lab, index) => (
                <option value={lab.lab_name}>{lab.lab_name}</option>
              ))}
            </select>
            <div style={{ fontSize: "0.85rem", color: "rgb(130, 130, 130)" }}>
              Select the lab that requires maintenance
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", flex: "1" }}>
            <div className="main-form-div" style={{ flex: "1" }}>
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div className="main-form-div" style={{ flex: "1" }}>
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <div className="main-form-div">
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="main-form-div" style={{ flex: "1" }}>
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="main-form-div" style={{ flex: "1" }}>
                <label htmlFor="end-time">End Time</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="main-form-div">
            <label htmlFor="main-reason">Maintenance Reason</label>
            <textarea
              name="main_reason"
              onChange={handleChange}
              value={formData.main_reason}
              id="main-reason"
              placeholder="Enter detailed reason for maintenance"
            ></textarea>
            <div style={{ fontSize: "0.85rem", color: "rgb(130, 130, 130)" }}>
              Provide a clear description of the maintenance work
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            style={{
              color: "white",
              backgroundColor: "black",
              fontSize: "0.85rem",
              textTransform: "none",
              padding: "0.5rem 0.8rem",
            }}
            onClick={handleSubmit}
          >
            Scheduled Maintenance
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

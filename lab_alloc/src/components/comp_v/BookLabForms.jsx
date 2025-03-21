import "./bookLabForms.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
export default function BookLabForm({ setPageState }) {
  const navigate = useNavigate();
  const [scheduleRequests, setScheduleRequests] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const cur_date = new Date();
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

  async function handleDecision(acceptance, session_id) {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/schedule_req/${session_id}/`,
        {
          status: acceptance,
          approved_by: "admin1",
        }
      );
      setRefresh((prevState) => !prevState);
    } catch (error) {
      console.error(
        "Error while approval:",
        error.response?.data || error.message
      );
    }
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/cur_schedules")
      .then((response) => {
        setScheduleRequests(response.data);
        console.log("Data : ", response.data);
      })
      .catch((error) =>
        console.log("Error while fetching Schedule_Request", error)
      );
  }, [refresh]);

  const [formData, setFormData] = useState({
    lab_name: "",
    schedule_date: null,
    schedule_from: null,
    schedule_to: null,
  });

  function handleOnChange(event) {
    const { name, value } = event.target;
    if (
      name === "schedule_to" &&
      new Date(`1970-01-01T${value}`) <=
        new Date(`1970-01-01T${formData.schedule_from}`)
    ) {
      alert("Not valid timing");
      setFormData((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !formData.lab_name ||
      !formData.schedule_date ||
      !formData.schedule_from ||
      !formData.schedule_to
    ) {
      alert("Please fill all the fields");
    }

    const username = "George";
    const data = new FormData();
    data.append("username", username);
    data.append("lab_name", formData.lab_name);
    data.append("schedule_date", formData.schedule_date);
    data.append("schedule_from", formData.schedule_from);
    data.append("schedule_to", formData.schedule_to);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/schedule_req/create",
      data
    );

    console.log(response.data);
    navigate("/");
  }

  function handleNavigate() {
    navigate("/");
  }

  return (
    <div>
      <Navbar setPageState={setPageState} handleNavigate={handleNavigate} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          margin: "5rem 1.2rem",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Roboto",
            fontSize: "1.7rem",
            fontWeight: "900",
          }}
        >
          Lab Allocation
        </div>
        <div
          style={{
            fontFamily: "Roboto",
            fontSize: "1rem",
            fontWeight: "400",
            color: " #6c757d",
          }}
        >
          Book labs for your classes and projects.
        </div>
        <div className="book-form-div">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}
          >
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            >
              Request a Lab Booking
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "0.9rem",
                fontWeight: "400",
                color: " #6c757d",
              }}
            >
              Fill out the form below to request a lab booking
            </div>
          </div>
          <form>
            <div
              style={{
                display: "flex",
                flex: "1",
                gap: "1rem",
                margin: "0.75rem 0rem",
              }}
            >
              <div className="session-input-div-1">
                <label htmlFor="schedule_date-1" className="input-label-1">
                  Date
                </label>
                <input
                  type="date"
                  id="schedule_date-1"
                  name="schedule_date"
                  value={formData.schedule_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleOnChange}
                />
              </div>
              <div className="session-input-div-1">
                <label htmlFor="lab_name-1" className="input-label-1">
                  Lab
                </label>
                <input
                  type="text"
                  placeholder="Enter the Laboratory Name"
                  name="lab_name"
                  id="lab_name-1"
                  value={formData.lab_name}
                  onChange={handleOnChange}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flex: "1",
                gap: "1rem",
                margin: "0.75rem 0rem",
              }}
            >
              <div className="session-input-div-1">
                <label htmlFor="schedule_from-1" className="input-label-1">
                  From
                </label>
                <input
                  id="schedule_from-1"
                  type="time"
                  name="schedule_from"
                  onChange={handleOnChange}
                  value={formData.schedule_from}
                />
              </div>
              <div className="session-input-div-1">
                <label htmlFor="schedule_to-1" className="input-label-1">
                  To
                </label>
                <input
                  id="schedule_to-1"
                  type="time"
                  name="schedule_to"
                  onChange={handleOnChange}
                  value={formData.schedule_to}
                />
              </div>
            </div>
            <div className="session-input-div-1">
              <label htmlFor="purpose-1" className="input-label-1">
                Purpose
              </label>
              <input
                id="purpose-1"
                type="text"
                name="purpose"
                onChange={handleOnChange}
                placeholder="Purpose of booking"
                //   value={formData.purpose}
              />
            </div>
            <div style={{ margin: "1rem 0rem" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  textTransform: "none",
                  width: "100%",
                  padding: "0.6rem 1rem",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
        <div>
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "1.7rem",
              fontWeight: "900",
            }}
          >
            Lab Booking Requests
          </div>
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "1rem",
              fontWeight: "400",
              color: " #6c757d",
            }}
          >
            Manage and view all lab booking requests.
          </div>
          <div>
            <table>
              <thead>
                <th>Date</th>
                <th>Lab</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </thead>
              {scheduleRequests.map((elem, index) => (
                <tr>
                  <td style={{ fontWeight: "500" }}>
                    {formatDate(elem.schedule_date)}
                  </td>
                  <td>{elem.lab_id}</td>
                  <td>
                    {elem.schedule_from} - {elem.schedule_to}
                  </td>
                  <td>Purpose</td>
                  <td>
                    <span
                      className={`span-status ${
                        elem.status === "approved"
                          ? "approved"
                          : elem.status === "rejected"
                          ? "rejected"
                          : "pending"
                      }`}
                    >
                      {elem.status}
                    </span>
                  </td>
                  <td>
                    {elem.status === "pending" ? (
                      <div style={{ display: "flex", flex: "1", gap: "1rem" }}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#3fb56a",
                            textTransform: "none",
                          }}
                          onClick={() => handleDecision("approved", elem.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#fee2e2",
                            color: "#ea7474",
                            textTransform: "none",
                          }}
                          onClick={() => handleDecision("rejected", elem.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      "No actions"
                    )}
                  </td>
                </tr>
              ))}
            </table>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "rgb(240, 240, 240)",
                padding: "1rem 0rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: "1",
                  fontFamily: "Roboto",
                  justifyContent: "center",
                  fontWeight: "450",
                  fontSize: "0.9rem",
                  margin: "0.7rem 0rem",
                }}
              >
                {scheduleRequests.length} lab booking requests
              </div>
              <div
                style={{
                  display: "flex",
                  flex: "1",
                  justifyContent: "center",
                  color: "rgb(100, 100, 100)",
                  fontWeight: "300",
                  fontFamily: "Roboto",
                  margin: "0.7rem 0rem",
                }}
              >
                A list of your recent lab booking requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

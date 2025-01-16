import Calendar from "./components/calender.jsx";
import CustomSelect from "./components/custom_select.jsx";
import NavBar from "./components/navbar.jsx";
import { FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import CustTimeLine from "./components/timeline.jsx";
import NewSession from "./components/new_session.jsx";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const events = [
    {
      id: 1,
      title: "George",
      schedule_from: "14:39:00",
      schedule_to: "16:44:00",
      color: "lightblue",
      rowStep: 0,
    },
    {
      id: 2,
      title: "Clara",
      schedule_from: "15:41:00",
      schedule_to: "17:46:00",
      color: "red",
      rowStep: 1,
    },
  ];
  const [schedule, setSchedule] = useState(events);
  const navigate = useNavigate();
  function handleNewSession() {
    navigate("/book");
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/schedule")
      .then((response) => {
        console.log("Response data:", response.data);
        setSchedule(response.data);
        console.log(response.data[0].schedule_from.split(":"));
      })
      .catch((error) => {
        console.error("Error while fetching:", error);
      });
  }, []);

  return (
    <>
      <NavBar />
      <Button
        variant="outlined"
        style={{ gap: "0.5rem", marginLeft: "2.3rem", marginTop: "1rem" }}
        onClick={handleNewSession}
      >
        <FaPlus />
        New
      </Button>
      <Routes>
        <Route path="/book" element={<NewSession />} />
      </Routes>
      <div className="canvas">
        <div className="canvas-left-div">
          <div>
            <h2 style={{ fontFamily: "Roboto", padding: "0px 6px" }}>
              Lab Utilization
            </h2>
          </div>
          <nav className="lab-nav">
            <button>Overview</button>
            <button>Calendar</button>
            <button>List</button>
            <button>Heatmap</button>
          </nav>
          <div className="canvas-comp">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ padding: "0px 6px", fontWeight: "600" }}>
                Calendar
              </div>
              <div>
                <CustomSelect />
              </div>
            </div>
            <div style={{ margin: "0rem 1rem" }}>
              <Calendar />
            </div>
            <div style={{ padding: "0px 6px", fontWeight: "600" }}>
              <div>Recent Bookings</div>
              <div className="recent-book-div">
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="canvas-right-div">
          <div>
            <h2>Details</h2>
          </div>
          <CustTimeLine data={schedule} />
        </div>
      </div>
    </>
  );
}
export default App;

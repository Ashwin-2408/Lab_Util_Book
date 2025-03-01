import Calendar from "./components/calender.jsx";
import CustomSelect from "./components/custom_select.jsx";
import NavBar from "./components/navbar.jsx";
import { FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import CustTimeLine from "./components/timeline.jsx";
import NewSession from "./components/new_session.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Stats from "./components/stats_table.jsx";
import axios from "axios";
import labImg1 from "./assets/lab_img1.jpg";
import labImg2 from "./assets/lab_img2.jpg";
import ApproveSession from "./components/approve_sess.jsx";

function App() {
  const [pageState, setPageState] = useState("LabAlloc");
  const [schedule, setSchedule] = useState([]);
  const currentDate = new Date();
  const [curDate, setCurDate] = useState(currentDate);
  const [customSelect, setCustomSelect] = useState([{ lab_name: "--All--" }]);
  const [curLab, setCurLab] = useState("--All--");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("All");
  const [curDashBoard, setDashBoard] = useState("overview");

  function handleNewSession() {
    navigate("/book");
  }

  function handleChangeDashboard(value) {
    setDashBoard(value);
  }

  useEffect(() => {
    if (curLab !== "--All--") {
      axios
        .get(`http://127.0.0.1:8000/api/schedule/${curLab}/${curDate}`)
        .then((response) => setSchedule(response.data))
        .catch((error) => console.error("Error fetching Schedule:", error));
    }
  }, [curDate, curLab]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/laboratory")
      .then((response) => {
        setCustomSelect([{ lab_name: "--All--" }, ...response.data]);
      })
      .catch((error) => console.error("Error fetching Laboratories:", error));
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval); 
  }, []);

  const fetchNotifications = () => {
    axios
      .get("http://127.0.0.1:3001/notifications")
      .then((response) => {
        setNotifications(response.data);
        checkForAlerts(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  const checkForAlerts = (notifications) => {
    const now = new Date();2
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);
    const upcomingAlerts = notifications.filter(
      (notif) =>
        new Date(notif.sessionStartTime) >= now &&
        new Date(notif.sessionStartTime) <= fiveMinutesLater &&
        !notif.isRead
    );
    if (upcomingAlerts.length > 0) {
      upcomingAlerts.forEach((alert) => {
        window.alert(`There is a upcoming lab session for you .`);
        markAsRead(alert.id);
      });
    }
  };

  const markAsRead = (id) => {
    axios
      .patch(`http://127.0.0.1:3001/notifications/${id}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
        fetchNotifications();
      })
      .catch((error) => console.error("Error updating notification:", error));
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/notifications/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all notifications?");
    if (confirmed) {
      try {
        await axios.delete(`http://127.0.0.1:3001/notifications`);
        setNotifications([]);
      } catch (error) {
        console.error("Error deleting all notifications:", error);
      }
    }
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterCategory === "All") return true;
    if (filterCategory === "Booking") return notif.message.includes("booking");
    if (filterCategory === "Availability")
      return notif.message.includes("available");
    if (filterCategory === "Others") {
      return (
        !notif.message.includes("booking") &&
        !notif.message.includes("available")
      );
    }
    return false;
  });

  return (
    <>
      <NavBar setPageState={setPageState} />
      <Routes>
        <Route path="/book" element={<NewSession />} />
      </Routes>

      {pageState === "LabAlloc" && (
        <div>
          <Button
            variant="contained"
            style={{
              gap: "0.5rem",
              marginLeft: "2.3rem",
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "black",
              color: "#fff",
              fontFamily: "Roboto",
              fontSize: "0.75rem",
              textTransform: "none",
            }}
            onClick={handleNewSession}
          >
            Book a Lab
          </Button>
          <div className="canvas">
            <div className="canvas-left-div">
              <h2 style={{ fontFamily: "Roboto", padding: "0px 6px" }}>
                Lab Utilization
              </h2>
              <nav className="lab-nav">
                <button onClick={() => handleChangeDashboard("overview")}>
                  Overview
                </button>
                <button onClick={() => handleChangeDashboard("calendar")}>
                  Timeline
                </button>
                <button onClick={() => handleChangeDashboard("labstats")}>
                  Lab Stats
                </button>
                <button onClick={() => handleChangeDashboard("headmap")}>
                  Heatmap
                </button>
              </nav>
              <div className="canvas-comp">
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <div style={{ padding: "0px 6px", fontWeight: "600" }}>
                    Calendar
                  </div>
                  <div>
                    <CustomSelect labs={customSelect} setCurLab={setCurLab} />
                  </div>
                </div>
                <div style={{ margin: "0rem 1rem" }}>
                  <Calendar setCurDate={setCurDate} />
                </div>
              </div>
            </div>
            <div className="canvas-right-div">
              {curDashBoard === "calendar" && (
                <>
                  <h2>Calendar</h2>
                  {schedule && <CustTimeLine data={schedule} />}
                </>
              )}
              {curDashBoard === "notdecided" && (
                <>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      flex: "wrap",
                      gap: "1rem",
                      marginTop: "1rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "Roboto",
                        padding: "0rem",
                        margin: "0rem",
                      }}
                    >
                      Lab Statistics
                    </h2>
                    <Stats labs={customSelect} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {pageState === "Notification" && (
        <div style={{
             marginLeft: "2rem",
             padding: "1rem",
             width: "50%",
             maxWidth: "600px",
             fontFamily: 'Roboto, sans-serif', 
         }}>
             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                 <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333", margin: 0 }}>Notifications</h2>
                 <div>
                     <label htmlFor="notification-filter" style={{ marginRight: "0.5rem", fontSize: "0.9rem", color: "#666" }}>Filter by:</label>
                     <select
                         id="notification-filter"
                         value={filterCategory}
                         onChange={handleFilterChange}
                         style={{
                             padding: "0.3rem 0.6rem",
                             borderRadius: "5px",
                             borderColor: "#ccc",
                             fontSize: "0.9rem",
                             cursor: "pointer",
                             appearance: 'none', 
                             background: `url('data:image/svg+xml;utf8,<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 0.5rem center`,
                             backgroundSize: '16px',
                         }}
                     >
                         <option value="All">All</option>
                         <option value="Booking">Booking Updates</option>
                         <option value="Availability">Availability Updates</option>
                         <option value="Others">Others</option>
                     </select>
                 </div>
                 <Button
                   variant="contained"
                   style={{
                     backgroundColor: "#d32f2f",
                     color: "#fff",
                   }}
                   onClick={deleteAllNotifications}
                 >
                   Delete All
                 </Button>
             </div>

             <div className="notification-list">
                 {filteredNotifications.length > 0 ? (
                     filteredNotifications.map((notif, index) => (
                         <div
                             key={notif.id}
                             className="notification-item"
                             style={{
                                 backgroundColor: "#fff",
                                 border: "1px solid #eee",
                                 boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                 borderRadius: "5px",
                                 padding: "1rem", 
                                 marginBottom: "0.75rem", 
                                 display: "flex",
                                 alignItems: "center",
                                 cursor: "pointer",
                                 width: "100%", 
                                 justifyContent: "space-between", 
                             }}
                         >
                             <div style={{ display: 'flex', alignItems: 'center' }}> 
                                 <img
                                     src={index % 2 === 0 ? labImg1 : labImg2}
                                     alt="Notification"
                                     style={{
                                         width: "45px", 
                                         height: "45px",
                                         borderRadius: "50%",
                                         marginRight: "1rem", 
                                         objectFit: 'cover', 
                                     }}
                                 />
                                 <div>
                                     <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#444" }}>{notif.message}</div>
                                     <div style={{ fontSize: "0.8rem", color: "#777" }}>{new Date(notif.sessionStartTime).toLocaleString()}</div>
                                 </div>
                             </div>
                             <div> 
                                    <button onClick={() => deleteNotification(notif.id)} style={{
                                     marginLeft: '0.5rem',
                                     cursor: 'pointer',
                                     padding: '0.25rem 0.5rem',
                                     borderRadius: '4px',
                                     border: '1px solid #ccc',
                                     backgroundColor: '#fdd',   
                                     color: '#900',            
                                     fontWeight: 'bold',      
                                 }}>Delete</button>
                             </div>
                         </div>
                     ))
                 ) : (
                     <p style={{ fontSize: "0.9rem", color: "#777" }}>No new notifications.</p>
                 )}
             </div>
         </div>
      )}
      {pageState === "Approve" && <ApproveSession />}
    </>
  );
}

export default App;

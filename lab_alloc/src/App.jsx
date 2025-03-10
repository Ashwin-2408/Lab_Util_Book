import Calendar from "./components/calender.jsx";
import CustomSelect from "./components/custom_select.jsx";
import NavBar from "./components/navbar.jsx";
import Button from "@mui/material/Button";
import CustTimeLine from "./components/timeline.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Stats from "./components/stats_table.jsx";
import Maintenance from "./components/comp_v/Maintenance.jsx";
import axios from "axios";
import {
  Trash,
  BellRing,
  CheckCircle,
  Info,
  XCircle,
  Filter,
  Check,
  TriangleAlert,
} from "lucide-react";
import labImg1 from "./assets/lab_img1.jpg";
import labImg2 from "./assets/lab_img2.jpg";
import Dashboard from "./components/comp_v/Dashboard.jsx";

function App({ pageState, setPageState }) {
  // const [pageState, setPageState] = useState("Dashboard");
  const [totalLabs, setTotalLabs] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const currentDate = new Date();
  const [curDate, setCurDate] = useState(currentDate);
  const [customSelect, setCustomSelect] = useState([{ lab_name: "--All--" }]);
  const [curLab, setCurLab] = useState("--All--");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [curDashBoard, setDashBoard] = useState("timeline");
  const [filterOpen, setFilterOpen] = useState(false);
  const [notificationFilters, setNotificationFilters] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [timeMainData, setTimeMainData] = useState([]);

  function formatDate(date) {
    const dateObj = new Date(date);
    return dateObj.toISOString().split("T")[0];
  }
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/maintenance")
      .then((response) => {
        setMainData(response.data);
      })
      .catch((error) => console.log("Error while fetching maintenance"));
  }, []);

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
        .then((response) => {
          setSchedule(response.data), console.log("Schedule", response.data);
        })
        .catch((error) => console.error("Error fetching Schedule:", error));
    }
  }, [curDate, curLab]);

  useEffect(() => {
    if (curLab != "--All--") {
      axios
        .get(
          `http://127.0.0.1:8000/api/maintenance/${formatDate(
            curDate
          )}/${curLab}`
        )
        .then((response) => {
          setTimeMainData(response.data.data);
          console.log("Maintenance", response.data);
        })
        .catch((error) => {
          setTimeMainData([]), console.log("Error", error);
        });
    }
  }, [curDate, curLab]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/laboratory")
      .then((response) => {
        setCustomSelect([{ lab_name: "--All--" }, ...response.data]);
        setTotalLabs(response.data.length);
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
    const now = new Date();
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);
    const upcomingAlerts = notifications.filter(
      (notif) =>
        new Date(notif.timestamp) >= now &&
        new Date(notif.timestamp) <= fiveMinutesLater &&
        !notif.isRead
    );
    if (upcomingAlerts.length > 0) {
      upcomingAlerts.forEach((alert) => {
        window.alert(`There is a upcoming lab session for you .`);
      });
    }
  };

  const markNAsRead = async (id) => {
    console.log("Marking as read:", id);

    axios
      .patch(`http://127.0.0.1:3001/notifications/${id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
      })
      .catch((error) => {
        console.error("Error updating notification:", error.response || error);
      });
  };

  const markAllAsRead = async () => {
    axios
      .patch(`http://127.0.0.1:3001/notifications`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
      })
      .catch((error) => console.error("Error updating notifications:", error));
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
    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );
    if (confirmed) {
      try {
        await axios.delete(`http://127.0.0.1:3001/notifications`);
        setNotifications([]);
      } catch (error) {
        console.error("Error deleting all notifications:", error);
      }
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const applyFilter = (filterType) => {
    if (notificationFilters.includes(filterType)) {
      setNotificationFilters(
        notificationFilters.filter((f) => f !== filterType)
      );
    } else {
      setNotificationFilters([...notificationFilters, filterType]);
    }
  };

  const filteredNotifications = () => {
    if (
      notificationFilters.length === 0 ||
      notificationFilters.includes("all")
    ) {
      return notifications;
    }

    let filtered = notifications;

    if (notificationFilters.includes("unread")) {
      filtered = filtered.filter((notification) => !notification.isRead);
    }

    const typeFilters = notificationFilters.filter(
      (f) => f !== "unread" && f !== "all"
    );
    if (typeFilters.length > 0) {
      filtered = filtered.filter((notification) =>
        typeFilters.includes(notification.type)
      );
    }

    return filtered;
  };

  const isFilterSelected = (filterType) => {
    return notificationFilters.includes(filterType);
  };

  return (
    <>
      <NavBar setPageState={setPageState} />
      {pageState === "Dashboard" && (
        <Dashboard totalLabs={totalLabs} setPageState={setPageState} />
      )}
      {pageState === "LabAlloc" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            justifyContent: "center",
          }}
        >
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
              width: "fit-content",
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
              <div className="lab-nav">
                <button onClick={() => handleChangeDashboard("overview")}>
                  Overview
                </button>
                <button onClick={() => handleChangeDashboard("timeline")}>
                  Timeline
                </button>
                <button onClick={() => handleChangeDashboard("labstats")}>
                  Lab Stats
                </button>
                <button onClick={() => handleChangeDashboard("headmap")}>
                  Heatmap
                </button>
              </div>
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
            {curDashBoard === "timeline" && (
              <div className="canvas-right-div">
                <h2>Timeline</h2>
                {schedule && (
                  <CustTimeLine data={schedule} mainData={timeMainData} />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {curDashBoard === "labstats" && (
        <>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1rem",
              margin: "2rem",
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
      {pageState === "Maintenance" && (
        <Maintenance customSelect={customSelect} mainData={mainData} />
      )}
      {pageState === "Notification" && (
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              width: "100%",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  marginRight: "auto",
                  fontFamily: "Roboto",
                }}
              >
                Notifications
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#6B7280",
                  marginBottom: "1rem",
                  fontFamily: "Roboto",
                }}
              >
                Stay updated on your bookings, resource requests, and system
                announcements.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
              <div
                style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}
              >
                <div style={{ position: "relative" }}>
                  <button
                    style={{
                      border: "1px solid #9CA3AF",
                      padding: "0.6rem 1.2rem",
                      display: "flex",
                      alignItems: "center",
                      background: "white",
                      cursor: "pointer",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      transition: "background 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#F3F4F6")}
                    onMouseOut={(e) => (e.target.style.background = "white")}
                    onClick={toggleFilter}
                  >
                    <Filter
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        marginRight: "0.5rem",
                      }}
                    />{" "}
                    Filter
                  </button>
                  {filterOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        backgroundColor: "white",
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.5rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        zIndex: 10,
                        minWidth: "160px",
                      }}
                    >
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("all")}
                      >
                        {isFilterSelected("all") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        All
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("info")}
                      >
                        {isFilterSelected("info") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        Info
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("success")}
                      >
                        {isFilterSelected("success") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        Success
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("warning")}
                      >
                        {isFilterSelected("warning") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        Warning
                      </button>
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("error")}
                      >
                        {isFilterSelected("error") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        Error
                      </button>
                      <hr
                        style={{
                          border: "none",
                          borderBottom: "1px solid #D1D5DB",
                          margin: "0.5rem 0",
                        }}
                      />
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          color: "#374151",
                          transition: "background 0.2s ease-in-out",
                          ":hover": {
                            backgroundColor: "#F3F4F6",
                          },
                          display: "flex", // Add this
                          alignItems: "center", // And this
                        }}
                        onClick={() => applyFilter("unread")}
                      >
                        {isFilterSelected("unread") && (
                          <Check
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.5rem",
                            }}
                          />
                        )}
                        Unread Only
                      </button>
                    </div>
                  )}
                </div>

                <button
                  style={{
                    border: "1px solid #9CA3AF",
                    padding: "0.6rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    background: "white",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    transition: "background 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#F3F4F6")}
                  onMouseOut={(e) => (e.target.style.background = "white")}
                  onClick={() => markAllAsRead()}
                >
                  <Check
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      marginRight: "0.5rem",
                    }}
                  />{" "}
                  Mark all as read
                </button>

                <button
                  style={{
                    border: "1px solid #D97706",
                    padding: "0.6rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    background: "#EF4444",
                    color: "white",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "background 0.2s ease-in-out",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#DC2626")}
                  onMouseOut={(e) => (e.target.style.background = "#EF4444")}
                  onClick={() => deleteAllNotifications()}
                >
                  <Trash
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      marginRight: "0.5rem",
                    }}
                  />{" "}
                  Delete all
                </button>
              </div>
            </div>
          </div>

          {filteredNotifications().length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
              }}
            >
              <BellRing
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "#9CA3AF",
                  marginBottom: "0.5rem",
                }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#374151",
                }}
              >
                No notifications
              </h3>
              <p style={{ color: "#6B7280" }}>
                You don't have any notifications that match your current
                filters.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {filteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    position: "relative",
                    padding: "1rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.5rem",
                    backgroundColor: notification.isRead
                      ? "#FEFEFE"
                      : "#E5E7EB",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: "1rem",
                    }}
                  >
                    {notification.type === "success" && (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      />
                    )}
                    {notification.type === "info" && (
                      <Info
                        style={{
                          color: "#3B82F6",
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      />
                    )}
                    {notification.type === "error" && (
                      <XCircle
                        style={{
                          color: "#EF4444",
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      />
                    )}
                    {notification.type === "warning" && (
                      <TriangleAlert
                        style={{
                          color: "#F5ED00",
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      />
                    )}
                    <div>
                      <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                        {notification.title}
                      </span>
                      <p style={{ color: "#374151" }}>{notification.message}</p>
                      <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                        {new Date(notification.timestamp)
                          .toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "")}
                      </span>
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8rem",
                          backgroundColor: "#FEEEEF",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {notification.category}
                      </span>
                    </div>
                    {!notification.isRead ? (
                      <Check
                        style={{
                          position: "absolute",
                          top: "2.7rem",
                          right: "1.5rem",
                          color: "#6B7280",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => markNAsRead(notification.id)}
                      />
                    ) : (
                      <Trash
                        style={{
                          position: "absolute",
                          top: "2.7rem",
                          right: "1.5rem",
                          color: "#6B7280",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteNotification(notification.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;

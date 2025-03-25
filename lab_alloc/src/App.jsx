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
import Audit from "./components/comp_v/Audit.jsx";
import { Trash, BellRing, CheckCircle, Info, XCircle, Filter, Check, TriangleAlert, Scale, Bell, RefreshCcw} from "lucide-react";
import Dashboard from "./components/comp_v/Dashboard.jsx";
import WaitList from "./components/WaitList.jsx";
import { color } from "framer-motion";
import bellSound from "./assets/bell.mp3";
import moment from 'moment';

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
        if (response.data) setMainData(response.data);
      })
      .catch((error) => console.log("Error while fetching maintenance"));
  }, []);
  const [showModal,setShowModal] = useState(false);
  const [showSessionAlert,setShowSessionAlert] = useState(false);
  const [showNotif,setShowNotif] = useState(null);

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

  useEffect(() => {
    if (showSessionAlert) {
      playBellSound();
    }
  }, [showSessionAlert]);  

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
        setShowSessionAlert(true);
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

  const handleDeleteAll = () => {
    deleteAllNotifications();
    setShowModal(false);
  }

  const deleteAllNotifications = async () => {
      try {
        await axios.delete(`http://127.0.0.1:3001/notifications`);
        setNotifications([]);
      } catch (error) {
        console.error("Error deleting all notifications:", error);
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

  const playBellSound = () => {
    const audio = new Audio(bellSound);
    audio.play();
  };

  const openNotification = (notificationId) => {
    setShowNotif(notificationId);
  };
  
  const closeNotification = () => {
    setShowNotif(null);
  };
  


  return (
    <>
      <NavBar setPageState={setPageState} />
      {showSessionAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">🔔IMPORTANT MESSAGE</h3>
            <p>You have an UpComing Session,Please Check Your Notifications</p>
            <button className="close-btn" onClick={() => setShowSessionAlert(false)}>OK</button>
          </div>
        </div>
      )}
      {pageState === "Dashboard" && (
        <Dashboard totalLabs={totalLabs} setPageState={setPageState} />
      )}
      {pageState === "WaitList" && <WaitList />}
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
      {curDashBoard === "labstats" && pageState === "LabAlloc" && (
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
      {pageState === "auditlog" && <Audit />}
      {pageState === "Notification" && (
        <div style={{ maxWidth: '72rem', margin: '2.5rem auto', padding: '1.5rem',fontFamily:'Poppins' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginRight: 'auto' }}>Notifications</h2>
              <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '1rem' }}>Stay updated on your bookings, resource requests, and system announcements.</p>
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
                    onMouseOver={(e) => e.target.style.background = '#E5E7EB'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
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
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex', 
                          alignItems: 'center' 
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
                      <hr style={{ border: 'none', borderBottom: '1.5px solid #D1D5DB', margin: '0 auto',width: '90%' }} />
                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex',  
                          alignItems: 'center' 
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
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex',  
                          alignItems: 'center' 
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
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex',  
                          alignItems: 'center' 
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
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex',  
                          alignItems: 'center' 
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
                      <hr style={{ border: 'none', borderBottom: '1.5px solid #D1D5DB', margin: '0 auto',width: '90%' }} />
                      <button
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#374151',
                          transition: 'background 0.2s ease-in-out',
                          ':hover': {
                            backgroundColor: '#F3F4F6'
                          },
                          display: 'flex',  
                          alignItems: 'center' 
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
                  onMouseOver={(e) => e.target.style.background = '#E5E7EB'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
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
                  onMouseOver={(e) => e.target.style.background = '#DC2626'}
                  onMouseOut={(e) => e.target.style.background = '#EF4444'}
                  onClick={() => setShowModal(true)}
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
                {showModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3 className="modal-title">Are you sure you want to Delete?</h3>
                      <p>This will delete all your notifications</p>
                      <p className="warning">⚠ This action cannot be undone.</p>
                      <button className="confirm-btn" onClick={() => handleDeleteAll()}>Yes, Delete</button>
                      <button className="close-btn" onClick={() => setShowModal(false)}>No, Keep It</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {filteredNotifications().map((notification) => (
        showNotif === notification.id && (  
        <div key={notification.id} className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="modal-content" style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '14px',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            animation: 'scaleIn 0.3s ease-in-out'
          }}>
            <button 
              onClick={closeNotification}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                color: '#777',
                cursor: 'pointer',
                transition: 'color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.color = '#222'}
          onMouseOut={(e) => e.target.style.color = '#777'}
        >
          ✖
        </button>

        <h3 className="modal-title" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#333'
        }}>
          📢 {notification.category} Notification
        </h3>

        <p style={{ fontSize: '1.1rem', marginBottom: '0.8rem', fontWeight: '500' }}>
          <strong>Title:</strong> <span style={{ color: '#222' }}>{notification.title}</span>
        </p>
        
        <p style={{ fontSize: '1rem', marginBottom: '0.8rem', color: '#444', lineHeight: '1.5' }}>
          <strong>Message:</strong> {notification.message}
        </p>
        
        <p className="timestamp" style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          <strong>Time:</strong> {new Date(notification.timestamp).toLocaleString()}
        </p>
        
        <button 
          className="close-btn"
          onClick={closeNotification}
          style={{
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'transform 0.2s, background 0.3s',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
          }}
          onMouseOver={(e) => e.target.style.background = 'linear-gradient(135deg, #15803D, #166534)'}
          onMouseOut={(e) => e.target.style.background = 'linear-gradient(135deg, #16A34A, #15803D)'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Close
        </button>
      </div>
    </div>
  )
))}



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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem',width: '98%',cursor: 'pointer' }}>
              {filteredNotifications().map((notification) => (
                
                <div className="notification-item" key={notification.id} style={{ position: 'relative', padding: '1rem', fontWeight: notification.isRead ? '300' : '500' , border: '1px solid #D1D5DB', borderRadius: '0.6rem', backgroundColor: notification.isRead ? '#FEFEFE' : '#EEEEEE', borderLeft: notification.isRead ? '4px solid #EEEEEE' : '4px solid #4A90E2', 
                  transition: 'all 0.3s ease-in-out', boxShadow: notification.isRead ? 'none' : '0px 2px 6px rgba(0, 0, 0, 0.1)' }}
                  onClick={() => openNotification(notification.id)}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    {notification.type === "success" && <CheckCircle style={{ color: '#10B981', width: '1.2rem', height: '1.2rem' }} />}
                    {notification.type === "info" && <Info style={{ color: '#3B82F6', width: '1.2rem', height: '1.2rem' }} />}
                    {notification.type === "error" && <XCircle style={{ color: '#EF4444', width: '1.2rem', height: '1.2rem' }} />}
                    {notification.type === "warning" && <TriangleAlert style={{ color: '#F5ED00', width: '1.2rem', height: '1.2rem' }} />}
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '600',fontFamily: 'Poppins',margin: '2px'}}>{notification.title}</span>
                      {!notification.isRead && (
                          <span style={{ margin: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.8rem', backgroundColor: '#4A90E2', borderRadius: '0.25rem' }}>New</span>
                      )}
                      <span style={{ fontSize: '0.85rem', color: '#444444', fontWeight: '400' , margin: '2px'}}>
                        {moment(notification.timestamp).fromNow()}
                      </span>
                    </div>
                    {!notification.isRead ? (
                      <>
                      <Check
                        style={{ position: 'absolute', top: '1rem', right: '4rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer',':hover': {color: '#000'} }}
                        onClick={(event) => {
                          event.stopPropagation();
                          markNAsRead(notification.id)}}  
                      />

                      <Trash
                        style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' , height: '22px' , weight: '22px'}}
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification.id)
                        }}
                      />
                      </>
                      
                    ) : (
                      <Trash
                        style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' , height: '22px' , weight: '22px'}}
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNotification(notification.id)}}
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

import { CalendarClock, CircleAlert, Plus, Calendar, List } from "lucide-react";
import ScheduleList from "./ScheduleList";
import ScheduleMain from "./ScheduleMain";
import CalendarView from "./CalenderView";
import "./maintenance.css";
import { useState, useEffect } from "react";
export default function Maintenance({customSelect, mainData}) {
  const [content, setContent] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [upcoming, setUpcoming] = useState(0);

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

  useEffect(() => {
    let completed = 0;
    let inprog = 0;
    let upcoming = 0;
    mainData.map((elem, _) => {
      let status = session_status(elem.start_date, elem.start_time);
      if (status === "completed") {
        completed += 1;
      } else if (status == "upcoming") {
        upcoming += 1;
      } else {
        inprog += 1;
      }
    });
    setCompleted(completed);
    setInProgress(inprog);
    setUpcoming(upcoming);
  }, []);

  const stats = [
    {
      label: "Total Scheduled",
      value: mainData.length,
    },
    {
      label: "In Progress",
      value: inProgress,
    },
    {
      label: "Upcoming",
      value: upcoming,
    },
    {
      label: "Completed",
      value: completed,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        margin: "7rem 1.5rem",
        fontFamily: "Roboto",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div
          style={{
            fontSize: "1.7rem",
            fontWeight: "900",
          }}
        >
          Maintenance Management
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: "400",
            color: " #6c757d",
          }}
        >
          Schedule and manage maintenance for labs and equipment
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "1rem",
          gap: "1rem",
        }}
      >
        <div
          style={{
            border: "1px solid rgb(217, 217, 217)",
            borderRadius: "0.5rem",
            width: "70%",
            padding: "1.5rem 1.2rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                fontSize: "1.5rem",
                fontWeight: "450",
              }}
            >
              <div>
                <CalendarClock strokeWidth={1.5} size={20} />
              </div>
              <div>Next Scheduled Maintenance</div>
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: "400",
                color: " #6c757d",
              }}
            >
              Upcoming maintenance work for the next 7 days
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "1rem",
              padding: "1rem 1rem",
              border: "1px solid rgb(217, 217, 217)",
              borderRadius: "0.5rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div>
                <CircleAlert strokeWidth={2} size={16} />
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "rgb(0, 0, 0)",
                }}
              >
                No upcoming maintenance
              </div>
            </div>
            <div style={{ fontSize: "0.9rem", padding: "0rem 1.5rem" }}>
              There are no maintenance tasks scheduled for the next 7 days.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              padding: "1.5rem 1.5rem",
              border: "1px solid rgb(217, 217, 217)",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            >
              Maintenance Stats
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: "400",
                color: " #6c757d",
              }}
            >
              Overview of maintenance activities
            </div>
            <div>
              {stats.map((elem, index) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "500",
                    padding: "0.75rem 0rem",
                    borderBottom: "1.5px solid rgb(228, 228, 228)",
                  }}
                >
                  <div style={{ fontSize: "0.88rem" }}>{elem.label}</div>
                  <div style={{ fontSize: "1.1rem" }}>{elem.value}</div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "1rem 0rem",
                }}
              >
                <div
                  style={{
                    height: "0.5rem",
                    backgroundColor: "rgb(233, 232, 237)",
                    borderRadius: "1rem",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgb(0, 0, 0)",
                      width: `${(completed / mainData.length) * 100}%`,
                      height: "0.5rem",
                      borderRadius: "1rem",
                    }}
                  ></div>
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgb(50, 50, 50)" }}>
                  {(completed / mainData.length) * 100}% Completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="maintenance-select">
        <button
          className={`maintenance-btn ${content === 0 ? "selected-btn" : ""}`}
          onClick={() => setContent(0)}
        >
          <div>
            <Plus strokeWidth={2} size={16} />
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Schedule Maintenance
          </div>
        </button>
        <button
          className={`maintenance-btn ${content === 1 ? "selected-btn" : ""}`}
          onClick={() => setContent(1)}
        >
          <div>
            <Calendar strokeWidth={2} size={16} />
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Calendar View
          </div>
        </button>
        <button
          className={`maintenance-btn ${content === 2 ? "selected-btn" : ""}`}
          onClick={() => setContent(2)}
        >
          <div>
            <List strokeWidth={2} size={16} />
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Schedules List
          </div>
        </button>
      </div>
      <div
        style={{
          padding: "1.5rem 1rem",
          border: "1px solid rgb(217, 217, 217)",
          borderRadius: "0.5rem",
        }}
      >
        {content === 0 && <ScheduleMain customSelect={customSelect} />}
        {content === 1 && <CalendarView />}
        {content === 2 && (
          <ScheduleList
            customSelect={customSelect}
            mainData={mainData}
          />
        )}
      </div>
    </div>
  );
}

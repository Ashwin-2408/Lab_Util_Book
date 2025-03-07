import "./maintenance.css";
import { useState } from "react";
export default function ScheduleList() {
  const [mainData, setMainData] = useState([]);
  return (
    <div style={{ margin: "0rem 0.5rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            fontSize: "1.5rem",
            fontWeight: "400",
          }}
        >
          All Maintenance Schedules
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "400",
            color: " #6c757d",
          }}
        >
          View and manage all maintenance schedules
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            fontSize: "1.2rem",
            fontWeight: "500",
            marginTop: "2rem",
          }}
        >
          Scheduled Maintenance
        </div>
        <div></div>
      </div>
      <div>
        <table>
          <thead>
            <th>Lab</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Actions</th>
          </thead>
          {mainData.map((elem, index) => (
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
      </div>
    </div>
  );
}

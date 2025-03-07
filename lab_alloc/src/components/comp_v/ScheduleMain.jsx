import "./maintenance.css";
import Button from "@mui/material/Button";
export default function ScheduleMain() {
  return (
    <div
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
            <select name="main-lab" id="select-main-lab">
              <option value="Quantum Lab">Quantum Lab</option>
              <option value="NeuroTech Lab">NeuroTech Lab</option>
            </select>
            <div style={{ fontSize: "0.85rem", color: "rgb(130, 130, 130)" }}>
              Select the lab that requires maintenance
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", flex: "1" }}>
            <div className="main-form-div" style={{ flex: "1" }}>
              <label htmlFor="start-date">Start Date</label>
              <input type="date" />
            </div>
            <div className="main-form-div" style={{ flex: "1" }}>
              <label htmlFor="start-time">Start Time</label>
              <input type="time" />
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
                <input type="date" />
              </div>
              <div className="main-form-div" style={{ flex: "1" }}>
                <label htmlFor="end-time">End Time</label>
                <input type="time" />
              </div>
            </div>
          </div>
          <div className="main-form-div">
            <label htmlFor="main-reason">Maintenance Reason</label>
            <textarea
              name=""
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
          >
            Scheduled Maintenance
          </Button>
        </div>
      </form>
    </div>
  );
}

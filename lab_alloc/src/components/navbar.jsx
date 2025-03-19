import { useState } from "react";
import Menu from "./menu.jsx";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Beaker,
  PackageOpen,
  BellRing,
  KanbanSquare,
  Wrench,
  CalendarSearch,
} from "lucide-react";

export default function NavBar(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [labShowDropDown, setLabShowDropDown] = useState(false);
  const navigate = useNavigate();

  function handlePageChange(page) {
    props.setPageState((prevState) => page);
    console.log("Changed State : ", page);
    props.handleNavigate();
  }

  return (
    <nav>
      <div className="nav-inner-div">
        <div className="logo-container">
          <Beaker strokeWidth={1.5} />
          <div className="logo-text">Lab Utilize</div>
        </div>
        <div className="nav-mid-div">
          <button
            onClick={() => handlePageChange("Dashboard")}
            className="nav-bar-btn"
          >
            <div>
              <LayoutDashboard strokeWidth={1.5} size={20} />
            </div>
            <div>Dashboard</div>
          </button>
          <div
            className="dropdown-container"
            onMouseEnter={() => setLabShowDropDown(true)}
            onMouseLeave={() => setLabShowDropDown(false)}
          >
            <button className="nav-bar-btn">
              <div>
                <Beaker strokeWidth={1.5} size={20} />
              </div>
              <div>Laboratory</div>
            </button>
            {labShowDropDown && (
              <div className="dropdown-menu">
                <button
                  onClick={() => handlePageChange("LabAlloc")}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <CalendarSearch strokeWidth={1.5} size={20} />
                  </div>
                  <div>Lab Allocation</div>
                </button>
                <button
                  onClick={() => handlePageChange("Maintenance")}
                  style={{ display: "flex", gap: "0.2rem" }}
                >
                  <div>
                    <Wrench strokeWidth={1.5} size={20} />
                  </div>
                  <div>Lab Maintenance</div>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => handlePageChange("Resource")}
            className="nav-bar-btn"
          >
            <div>
              <PackageOpen strokeWidth={1.5} size={20} />
            </div>
            <div>Resource Allocation</div>
          </button>
          {/* Manage Labs Dropdown */}
          <div
            className="dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="nav-bar-btn">
              <div>
                <KanbanSquare strokeWidth={1.5} size={20} />
              </div>
              <div>Manage Labs</div>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => handlePageChange("Renew Lab")}>
                  Renew Lab
                </button>
                <button onClick={() => handlePageChange("Lab Bookings")}>
                  Lab Bookings
                </button>
                <button onClick={() => navigate("/cancel-lab")}>
                  Cancel Lab
                </button>{" "}
                {/* Navigate to cancel lab page */}
              </div>
            )}
          </div>
          <button
            onClick={() => handlePageChange("Notification")}
            className="nav-bar-btn"
          >
            <div>
              <BellRing strokeWidth={1.5} size={20} />
            </div>
            <div>Notifications</div>
          </button>
        </div>
        <div className="nav-right-div">
          <Menu />
        </div>
      </div>
    </nav>
  );
}

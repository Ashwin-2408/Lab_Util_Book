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
  ClipboardList,
  BarChart,
  Settings,
} from "lucide-react";

export default function NavBar(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [labShowDropDown, setLabShowDropDown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const navigate = useNavigate();

  function handlePageChange(page) {
    if (page === "Resource") {
      navigate("/resource");
    }
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
            <LayoutDashboard strokeWidth={1.5} size={20} />
            <div>Dashboard</div>
          </button>

          {/* Laboratory Dropdown */}
          <div
            className="dropdown-container"
            onMouseEnter={() => setLabShowDropDown(true)}
            onMouseLeave={() => setLabShowDropDown(false)}
          >
            <button className="nav-bar-btn">
              <Beaker strokeWidth={1.5} size={20} />
              <div>Laboratory</div>
            </button>
            {labShowDropDown && (
              <div className="dropdown-menu">
                <button onClick={() => handlePageChange("LabAlloc")}>
                  <CalendarSearch strokeWidth={1.5} size={20} />
                  Lab Allocation
                </button>
                <button onClick={() => handlePageChange("Maintenance")}>
                  <Wrench strokeWidth={1.5} size={20} />
                  Lab Maintenance
                </button>
              </div>
            )}
          </div>

          {/* Resource Allocation */}
          <button
            onClick={() => handlePageChange("Resource")}
            className="nav-bar-btn"
          >
            <PackageOpen strokeWidth={1.5} size={20} />
            <div>Resource Allocation</div>
          </button>

          {/* Manage Labs Dropdown */}

          <div
            className="dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="nav-bar-btn">
              <KanbanSquare strokeWidth={1.5} size={20} />
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
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={() => handlePageChange("WaitList")}
            className="nav-bar-btn"
          >
            <div>
              <ClipboardList strokeWidth={1.5} size={20} />
            </div>
            <div>WaitList</div>
          </button>
          <button
            onClick={() => handlePageChange("Notification")}
            className="nav-bar-btn"
          >
            <BellRing strokeWidth={1.5} size={20} />
            <div>Notifications</div>
          </button>

          {/* Admin Dashboard Dropdown */}
          <div
            className="dropdown-container"
            onMouseEnter={() => setAdminDropdown(true)}
            onMouseLeave={() => setAdminDropdown(false)}
          >
            <button className="nav-bar-btn">
              <LayoutDashboard strokeWidth={1.5} size={20} />
              <div>Admin Dashboard</div>
            </button>
            {adminDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/admin/bookings")}>
                  <ClipboardList strokeWidth={1.5} size={20} />
                  Cancellation Management
                </button>
                <button onClick={() => navigate("/admin/reports-analytics")}>
                  <BarChart strokeWidth={1.5} size={20} />
                  Reports & Analytics
                </button>
                <button
                  onClick={() => navigate("/admin/auto-cancellation-rules")}
                >
                  <Settings strokeWidth={1.5} size={20} />
                  Auto-Cancellation Rules
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Menu */}
        <div className="nav-right-div">
          <Menu />
        </div>
      </div>
    </nav>
  );
}

import { useState } from "react";
import Menu from "./menu.jsx";
import { CiCircleQuestion } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Beaker,
  PackageOpen,
  BellRing,
  KanbanSquare,
} from "lucide-react";

export default function NavBar(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // For navigation

  function handlePageChange(page) {
    props.setPageState((prevState) => page);
    console.log("Changed State : ", page);
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
          <button
            onClick={() => handlePageChange("LabAlloc")}
            className="nav-bar-btn"
          >
            <div>
              <Beaker strokeWidth={1.5} size={20} />
            </div>
            <div>Lab Allocation</div>
          </button>
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

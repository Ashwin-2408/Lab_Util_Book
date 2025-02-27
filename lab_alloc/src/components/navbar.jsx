import { useState } from "react";
import Menu from "./menu.jsx";
import { CiCircleQuestion } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
import { useNavigate } from "react-router-dom";

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
          <SiGooglegemini />
          <div className="logo-text">LabSync</div>
        </div>

        <div className="nav-right-div">
          <button onClick={() => handlePageChange("Schedule")}>Schedule</button>
          <button onClick={() => handlePageChange("Dashboard")}>Dashboard</button>

          {/* Manage Labs Dropdown */}
          <div
            className="dropdown-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="dropdown-btn">Manage Labs ▼</button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => handlePageChange("Renew Lab")}>Renew Lab</button>

                <button onClick={() => handlePageChange("Lab Bookings")}>Lab Bookings</button>
                <button onClick={() => navigate("/cancel-lab")}>Cancel Lab</button> {/* Navigate to cancel lab page */}
              </div>
            )}
          </div>

          <button onClick={() => handlePageChange("Members")}>Members</button>

          <div className="user-mag-div">
            <button className="notification-div">
              <CiCircleQuestion className="icon" />
            </button>
            <button className="notification-div">
              <IoNotificationsOutline className="icon" />
            </button>
            <div>
              <Menu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

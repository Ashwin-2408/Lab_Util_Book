import Menu from "./menu.jsx";
import { CiCircleQuestion } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
export default function NavBar() {
  return (
    <nav>
      <div className="nav-inner-div">
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SiGooglegemini />
          <div style={{ fontWeight: "450" }}>Lab Management</div>
        </div>
        <div className="nav-right-div">
          <a href="">Dashboard</a>
          <a href="">Schedule</a>
          <a href="">Manage Labs</a>
          <a href="">Members</a>
          <div className="user-mag-div">
            <button className="notification-div">
              <CiCircleQuestion style={{ width: "2rem", height: "2rem" }} />
            </button>
            <button className="notification-div">
              <IoNotificationsOutline style={{ fontSize: "1rem" }} />
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
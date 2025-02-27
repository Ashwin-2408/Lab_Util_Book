import Menu from "./menu.jsx";
import { CiCircleQuestion } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
export default function NavBar(props) {
  function handlePageChange(page) {
    props.setPageState((prevState) => page);
    console.log("Changed State : ", page);
  }
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
          <div style={{ fontWeight: "450" }}>LabSync</div>
        </div>
        <div className="nav-right-div">
          <button onClick={() => handlePageChange("Schedule")}>Schedule</button>
          <button onClick={() => handlePageChange("Dashboard")}>
            Dashboard
          </button>
          <button onClick={() => handlePageChange("Manage Labs")}>
            Manage Labs
          </button>
          <button onClick={() => handlePageChange("Members")}>Members</button>
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
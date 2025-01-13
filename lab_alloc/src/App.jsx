import Menu from "./components/menu.jsx";
import { CiCircleQuestion } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { SiGooglegemini } from "react-icons/si";
import Calendar from "./components/calender.jsx";
import CustomSelect from "./components/custom_select.jsx";
function App() {
  return (
    <>
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
                <CiCircleQuestion style={{ fontSize: "1.25rem" }} />
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
      <div className="canvas">
        <div className="canvas-inner-div">
          <div>
            <h2 style={{ fontFamily: "Roboto", padding: "0px 6px" }}>
              Lab Utilization
            </h2>
          </div>
          <nav className="lab-nav">
            <button>Overview</button>
            <button>Calendar</button>
            <button>List</button>
            <button>Heatmap</button>
          </nav>
          <div className="canvas-comp">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ padding: "0px 6px", fontWeight: "600" }}>
                Calendar
              </div>
              <div>
                <CustomSelect />
              </div>
            </div>
            <div style={{ margin: "0rem 1rem" }}>
              <Calendar />
            </div>
            <div style={{ padding: "0px 6px", fontWeight: "600" }}>
              <div>Recent Bookings</div>
              <div className="recent-book-div">
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;

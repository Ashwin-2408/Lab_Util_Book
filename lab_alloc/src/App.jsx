import Calendar from "./components/calender.jsx";
import CustomSelect from "./components/custom_select.jsx";
import NavBar from "./components/navbar.jsx";
function App() {
  return (
    <>
      <NavBar />
      <div className="canvas">
        <div className="canvas-left-div">
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
        <div className="canvas-right-div">
          <div>
            <h2>Details</h2>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;

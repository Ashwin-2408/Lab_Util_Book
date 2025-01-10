import Menu from "./components/menu.jsx";
function App() {
  return (
    <>
      <nav>
        <div className="nav-inner-div">
          <div style={{ fontWeight: "450" }}>Lab Management</div>
          <div className="nav-right-div">
            <div>Dashboard</div>
            <div>Schedule</div>
            <div>Manage Labs</div>
            <div>Members</div>
            <div>
              <Menu />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default App;

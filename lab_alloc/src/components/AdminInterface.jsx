import NavBar from "./navbar";
import AdminResourceAllocation from "./AdminResourceAllocation";
const AdminInterface = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <NavBar style={{ position: "relative", zIndex: 10 }} />
      <main
        style={{
          flex: 1,
          marginTop: "60px", // Add space below the NavBar
          position: "relative",
        }}
      >
        <AdminResourceAllocation />
      </main>
    </div>
  );
};

export default AdminInterface;

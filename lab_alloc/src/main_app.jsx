import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NewSession from "./components/new_session.jsx";
import ApproveSession from "./components/approve_sess.jsx";
import AdminInterface from "./components/AdminInterface.jsx";

import ResourceAllocationInterface from "./components/Resource_Allocation_Interface.jsx";

import Scanner from "./components/scanner.jsx";
import CheckIn from "./components/check_in_div.jsx";
import CancelLab from "./components/CancelLab.jsx";
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<NewSession />} />
        <Route path="/temp" element={<ApproveSession />} />
        <Route
          path="/resource"
          element={<ResourceAllocationInterface></ResourceAllocationInterface>}
        />
        <Route path="/temp" element={<Scanner />} />
        <Route path="/cancel-lab" element={<CancelLab />} />
        <Route path="/admin" element={<AdminInterface></AdminInterface>} />
      </Routes>
    </Router>
  );
}

export default MainApp;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NewSession from "./components/new_session.jsx";
import Scanner from "./components/scanner.jsx";
import CancelLab from "./components/CancelLab.jsx";
import Approve from "./components/approve_sess.jsx";
import ApprovePopUp from "./components/approve_popup.jsx";
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<NewSession />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/cancel-lab" element={<CancelLab />} />
        <Route path="/temp" element={<Approve />} />
      </Routes>
    </Router>
  );
}

export default MainApp;

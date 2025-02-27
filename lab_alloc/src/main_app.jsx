import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NewSession from "./components/new_session.jsx";
import ApproveSession from "./components/approve_sess.jsx";
import CancelLab from "./components/CancelLab.jsx";
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<NewSession />} />
        <Route path="/temp" element={<ApproveSession />} />
        <Route path="/cancel-lab" element={<CancelLab />} />

      </Routes>
    </Router>
  );
}

export default MainApp;

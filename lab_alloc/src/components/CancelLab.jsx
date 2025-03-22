import React, { useState, useEffect } from "react";
import NavBar from "./navbar.jsx";

export default function CancelLab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledLabs, setScheduledLabs] = useState([
    { id: 1, name: "AI Lab", date: "2025-03-10", time: "10:00 AM - 12:00 PM" },
    {
      id: 2,
      name: "Cybersecurity Lab",
      date: "2025-03-12",
      time: "2:00 PM - 4:00 PM",
    },
    {
      id: 3,
      name: "Robotics Lab",
      date: "2025-03-15",
      time: "1:00 PM - 3:00 PM",
    },
  ]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPolicy, setShowPolicy] = useState(
    localStorage.getItem("hasSeenPolicy") !== "true"
  );

  useEffect(() => {
    if (showPolicy === false) {
      localStorage.setItem("hasSeenPolicy", "true");
    }
  }, [showPolicy]);

  const handleCancelLab = () => {
    setScheduledLabs((prev) => prev.filter((lab) => lab.id !== selectedLab.id));
    setShowModal(false);
    alert("Lab session canceled successfully.");
  };

  return (
    <>
      <NavBar />
      <div className="cancel-lab-container">
        {/* Display Cancellation Policy Only the First Time */}
        {showPolicy && (
          <div className="policy-container">
            <h2 className="policy-title"> Cancellation Policy</h2>
            <ul className="policy-list">
              <li className="policy-item">
                ✔ Cancel <b>24 hours</b> before → No penalty.
              </li>
              <li className="policy-item">
                ⚠ Cancel <b>within 12 hours</b> → May incur a penalty.
              </li>
              <li className="policy-item">
                ❌ <b>No-shows</b> may lose booking access.
              </li>
              <li className="policy-item">
                📧 Contact <b>support@labsync.com</b> for assistance.
              </li>
            </ul>
            <button
              className="close-policy-btn"
              onClick={() => setShowPolicy(false)}
            >
              Got It
            </button>
          </div>
        )}

        {/* Button to Review Policy */}
        {!showPolicy && (
          <button
            className="review-policy-btn"
            onClick={() => setShowPolicy(true)}
            style={{ marginBottom: "20px" }}
          >
            📜 Review Cancellation Policy
          </button>
        )}

        {/* 🔍 Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search lab session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* 🗂 Lab List */}
        <div className="lab-list">
          {scheduledLabs
            .filter((lab) =>
              lab.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((lab) => (
              <div key={lab.id} className="lab-item">
                <span>
                  {" "}
                  {lab.name} - {lab.date} ({lab.time})
                </span>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectedLab(lab);
                    setShowModal(true);
                  }}
                >
                  Cancel
                </button>
              </div>
            ))}
        </div>

        {/* ❗ Confirmation Modal */}
        {showModal && selectedLab && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Are you sure you want to cancel?</h3>
              <p>
                Lab: <b>{selectedLab.name}</b>
              </p>
              <p>
                Date: <b>{selectedLab.date}</b> | Time:{" "}
                <b>{selectedLab.time}</b>
              </p>
              <p className="warning">⚠ This action cannot be undone.</p>
              <button className="confirm-btn" onClick={handleCancelLab}>
                Yes, Cancel
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                No, Keep It
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

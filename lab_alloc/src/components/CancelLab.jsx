import React, { useState } from "react";

export default function CancelLab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledLabs, setScheduledLabs] = useState([
    { id: 1, name: "AI Lab", date: "2025-03-10", time: "10:00 AM - 12:00 PM" },
    { id: 2, name: "Cybersecurity Lab", date: "2025-03-12", time: "2:00 PM - 4:00 PM" },
    { id: 3, name: "Robotics Lab", date: "2025-03-15", time: "1:00 PM - 3:00 PM" },
  ]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCancelLab = () => {
    setScheduledLabs((prev) => prev.filter((lab) => lab.id !== selectedLab.id));
    setShowModal(false);
    alert("Lab session canceled successfully.");
  };

  return (
    <div className="cancel-lab-container">
      {/* 🛑 Cancellation Policies */}
      <div className="policy-container">
        <h2>🛑 Cancellation Policy</h2>
        <ul>
          <li>✔ Cancel <b>24 hours</b> before → No penalty.</li>
          <li>⚠ Cancel <b>within 12 hours</b> → May incur a penalty.</li>
          <li>❌ <b>No-shows</b> may lose booking access.</li>
          <li>📧 Contact <b>support@labsync.com</b> for assistance.</li>
        </ul>
      </div>

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
              <span>🧪 {lab.name} - {lab.date} ({lab.time})</span>
              <button className="cancel-btn" onClick={() => { 
                setSelectedLab(lab); 
                setShowModal(true); 
              }}>
                Cancel
              </button>
            </div>
          ))}
      </div>

      {/* ❗ Confirmation Modal */}
      {showModal && selectedLab && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to cancel?</h3>
            <p>Lab: <b>{selectedLab.name}</b></p>
            <p>Date: <b>{selectedLab.date}</b> | Time: <b>{selectedLab.time}</b></p>
            <p className="warning">⚠ This action cannot be undone.</p>
            <button className="confirm-btn" onClick={handleCancelLab}>Yes, Cancel</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>No, Keep It</button>
          </div>
        </div>
      )}
    </div>
  );
}

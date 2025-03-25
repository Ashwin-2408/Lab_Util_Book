import React, { useState, useEffect } from "react";
import NavBar from "./navbar.jsx";

export default function CancelLab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledLabs, setScheduledLabs] = useState([
    {
      id: 1,
      name: "AI Lab",
      date: "2025-03-10",
      timeSlots: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
    },
    {
      id: 2,
      name: "Cybersecurity Lab",
      date: "2025-03-12",
      timeSlots: ["2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM"],
    },
    {
      id: 3,
      name: "Robotics Lab",
      date: "2025-03-15",
      timeSlots: ["1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM"],
    },
  ]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPolicy, setShowPolicy] = useState(
    localStorage.getItem("hasSeenPolicy") !== "true"
  );

  useEffect(() => {
    if (showPolicy === false) {
      localStorage.setItem("hasSeenPolicy", "true");
    }
  }, [showPolicy]);

  const handleCancelTimeSlot = () => {
    setScheduledLabs((prev) =>
      prev.map((lab) =>
        lab.id === selectedLab.id
          ? {
              ...lab,
              timeSlots: lab.timeSlots.filter((slot) => slot !== selectedTimeSlot),
            }
          : lab
      ).filter((lab) => lab.timeSlots.length > 0) // Remove lab if all slots are canceled
    );
    setShowModal(false);
    alert("Time slot canceled successfully.");
  };

  return (
    <>
      <NavBar />
      <div className="cancel-lab-container">
        {showPolicy && (
          <div className="policy-container">
            <h2 className="policy-title"> Cancellation Policy</h2>
            <ul className="policy-list">
              <li className="policy-item">✔ Cancel <b>24 hours</b> before → No penalty.</li>
              <li className="policy-item">⚠ Cancel <b>within 12 hours</b> → May incur a penalty.</li>
              <li className="policy-item">❌ <b>No-shows</b> may lose booking access.</li>
              <li className="policy-item">📧 Contact <b>support@labsync.com</b> for assistance.</li>
            </ul>
            <button className="close-policy-btn" onClick={() => setShowPolicy(false)}>Got It</button>
          </div>
        )}

        {!showPolicy && (
          <button className="review-policy-btn" onClick={() => setShowPolicy(true)}>
            📜 Review Cancellation Policy
          </button>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search lab session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="lab-list">
          {scheduledLabs
            .filter((lab) =>
              lab.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((lab) => (
              <div key={lab.id} className="lab-item">
                <h3>{lab.name} - {lab.date}</h3>
                {lab.timeSlots.map((slot) => (
                  <div key={slot} className="time-slot">
                    <span>{slot}</span>
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setSelectedLab(lab);
                        setSelectedTimeSlot(slot);
                        setShowModal(true);
                      }}
                    >
                      Cancel Slot
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {showModal && selectedLab && selectedTimeSlot && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Are you sure you want to cancel?</h3>
              <p>
                Lab: <b>{selectedLab.name}</b>
              </p>
              <p>
                Date: <b>{selectedLab.date}</b> | Time: <b>{selectedTimeSlot}</b>
              </p>
              <p className="warning">⚠ This action cannot be undone.</p>
              <button className="confirm-btn" onClick={handleCancelTimeSlot}>
                Yes, Cancel Slot
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

import React, { useState } from "react";

const LabBookingForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    lab: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="form-container">
      <h2>Lab Allocation</h2>
      <p>Book labs for your classes and projects.</p>
      <form onSubmit={handleSubmit} className="lab-form">
        <h3>Request a Lab Booking</h3>
        <p>Fill out the form below to request a lab booking.</p>

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Lab</label>
        <select
          name="lab"
          value={formData.lab}
          onChange={handleChange}
          required
        >
          <option value="">Select a lab</option>
          <option value="lab1">Lab 1</option>
          <option value="lab2">Lab 2</option>
          <option value="lab3">Lab 3</option>
        </select>

        <label>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
        />

        <label>Purpose</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Purpose of booking"
          required
        />

        <button type="submit">Submit Request</button>
      </form>

      <style>{`
        .form-container {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
        }
        h2, h3 {
          text-align: center;
        }
        .lab-form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-top: 10px;
          font-weight: bold;
        }
        input, select, textarea {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background: black;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 15px;
        }
        button:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default LabBookingForm;

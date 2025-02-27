import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminRequests.css"; // Ensure you have appropriate styles

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/resource/requests"
      );
      setRequests(response.data);
    } catch (err) {
      setError("Error fetching resource requests.");
      console.error(err);
    }
    setLoading(false);
  };

  const approveRequest = async (requestId) => {
    try {
      await axios.patch(`http://localhost:3001/resource/${requestId}/approve`);
      alert("Request approved successfully!");
      fetchRequests();
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request.");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.patch(`http://localhost:3001/resource/${requestId}/reject`);
      alert("Request rejected successfully!");
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Admin Resource Requests</h2>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">{error}</p>}

      {requests.length > 0 ? (
        <table className="request-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Resource ID</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.user_id}</td>
                <td>{req.resource_id}</td>
                <td className={`status ${req.status.toLowerCase()}`}>
                  {req.status}
                </td>
                <td>{new Date(req.createdAt).toLocaleString()}</td>
                <td>
                  {req.status === "Pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => approveRequest(req.request_id || req.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => rejectRequest(req.request_id || req.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default AdminRequests;

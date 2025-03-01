import { useState, useEffect } from "react";
import axios from "axios";
import "./UserRequests.css"; // Import CSS file

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/resource/requests/user",
        { userId }
      );
      setRequests(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Error fetching user requests.");
      console.error(err);
    }
    setLoading(false);
  };

  const releaseResource = async (requestId) => {
    try {
      console.log(requestId);
      await axios.patch(`http://localhost:3001/resource/${requestId}/release`);
      alert("Resource released successfully!");
      fetchRequests(); // Refresh list after release
    } catch (err) {
      console.error("Error releasing resource:", err);
      alert("Failed to release resource.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">My Resource Requests</h2>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">{error}</p>}

      {requests.length > 0 ? (
        <ul className="request-list">
          {requests.map((req) => {
            console.log(req); // Debug: Check what properties exist
            return (
              <li key={req.id} className="request-item">
                <span>
                  <strong>Resource ID:</strong> {req.resource_id} |{" "}
                  <strong>Status:</strong>{" "}
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </span>
                <span>
                  <strong>Requested On:</strong>{" "}
                  {new Date(req.createdAt).toLocaleString()}
                </span>

                {/* Show "Release" button only if request is approved */}
                {req.status === "Approved" && (
                  <button
                    className="release-btn"
                    onClick={() => releaseResource(req.request_id || req.id)}
                  >
                    Release
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default UserRequests;

import { useState, useEffect } from "react";
import axios from "axios";
import "./UserRequests.css"; // Import CSS file

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/resource/requests/user",
          {
            userId,
          }
        );
        setRequests(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Error fetching user requests.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return (
    <div className="container">
      <h2 className="title">My Resource Requests</h2>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">{error}</p>}

      {requests.length > 0 ? (
        <ul className="request-list">
          {requests.map((req) => (
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
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default UserRequests;

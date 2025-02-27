import { useState } from "react";
import axios from "axios";
import "./LabResourceRequest.css"; // Import the CSS file

const LabResourceRequest = () => {
  const [labName, setLabName] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserID] = useState(1);
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/resource/available",
        {
          labName,
          resourceType,
        }
      );

      console.log(response.data);

      // Extract quantity and resourceIds array
      const { quantity, resourceIds } = response.data;

      // Convert it into an array of objects for display
      const formattedResources = resourceIds.map((id) => ({
        id,
        status: "Available", // Assuming all returned resources are available
      }));

      setResources(formattedResources);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
    setLoading(false);
  };

  const handleRequest = async (resourceId) => {
    try {
      await axios.post("http://localhost:3001/resource/request", {
        resourceId,
        userId,
      });
      alert(`Request placed successfully for Resource ID: ${resourceId}`);
    } catch (error) {
      console.error("Error requesting resource", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Search Lab Resources</h2>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Lab Name"
          className="input-field"
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Resource Type"
          className="input-field"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div>
        {resources.length > 0 ? (
          <div>
            <p>
              <strong>Total Available:</strong> {resources.length}
            </p>
            <ul className="resource-list">
              {resources.map((resource) => (
                <li key={resource.id} className="resource-item">
                  <span>
                    <strong>ID:</strong> {resource.id} |{" "}
                    <strong>Status:</strong> {resource.status}
                  </span>
                  <button
                    className="request-button"
                    onClick={() => handleRequest(resource.id)}
                  >
                    Request
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default LabResourceRequest;

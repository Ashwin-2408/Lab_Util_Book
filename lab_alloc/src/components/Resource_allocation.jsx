import React, { useState, useEffect } from "react";
import "./ResourceAllocation.css";
import axios from "axios";

const ResourceAllocation = () => {
  const [labSearch, setLabSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // In a real app, you would get this from authentication/user context
  const currentUserId = 1; // Replace with actual user ID or get from auth context

  const [userRequests, setUserRequests] = useState([]);
  const [resources, setResources] = useState([]);
  const [requestingResource, setRequestingResource] = useState(null);
  const [releasingResource, setReleasingResource] = useState(null);

  // Function to transform ResourceRequest Sequelize objects to match component props
  const transformResourceRequests = (requests) => {
    if (!Array.isArray(requests)) {
      console.error("Expected array of requests, got:", requests);
      return [];
    }

    return requests
      .map((request) => {
        // Debug what we're receiving
        console.log("Processing request object:", request);

        // Check if request is valid and has dataValues
        if (!request) {
          console.error("Request is undefined or null");
          return null;
        }

        // The problem might be with how we're accessing properties
        // Let's see what the structure actually looks like
        console.log("Request keys:", Object.keys(request));

        // Try accessing properties directly first
        const requestId =
          request.request_id ||
          (request.dataValues ? request.dataValues.request_id : null);
        const resourceId =
          request.resource_id ||
          (request.dataValues ? request.dataValues.resource_id : null);
        const status =
          request.status ||
          (request.dataValues ? request.dataValues.status : "pending");
        const createdDate =
          request.createdAt ||
          (request.dataValues ? request.dataValues.createdAt : new Date());

        // Extract resource data safely
        let resourceName = "Unknown Resource";
        let labName = "Unknown Lab";

        if (request.Resource) {
          const resource = request.Resource;
          resourceName =
            resource.type ||
            (resource.dataValues
              ? resource.dataValues.type
              : "Computer System");

          if (resource.lab) {
            labName = resource.lab.lab_name || "Unknown Lab";
          }
        }

        // Return a safe object with fallbacks for all properties
        return {
          id: requestId || 0,
          request_id: requestId || 0,
          resourceId: resourceId || 0,
          title: `Request for ${resourceName || "New"}`,
          dates: formatDate(createdDate),
          lab: labName,
          resource: resourceName,
          quantity: 1,
          status: status.toLowerCase(),
        };
      })
      .filter((item) => item !== null); // Remove any null items
  };
  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch user's resource requests
  const fetchUserRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/resource/requests/user",
        { userId: currentUserId }
      );

      console.log("Fetched user requests:", response.data); // Debugging

      // Transform the data to match component structure
      const formattedRequests = Array.isArray(response.data)
        ? transformResourceRequests(response.data)
        : [];
      console.log(formattedRequests);
      setUserRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching user requests:", err);

      // Handle different error cases
      setError(err.response?.data?.error || "Failed to load your requests.");
      setUserRequests([]); // Ensure state is always an array
    } finally {
      setRequestsLoading(false);
    }
  };

  // Load user requests on component mount
  useEffect(() => {
    fetchUserRequests();
  }, []);

  // Fetch resources from API based on search criteria
  const fetchResources = async () => {
    if (!labSearch && !resourceSearch) {
      // If both search fields are empty, don't make the API call
      setResources([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/resource/available",
        {
          labName: labSearch,
          resourceType: resourceSearch,
        }
      );

      // Transform the API response to match the component's data structure
      const formattedResources = response.data.resources.map((item) => ({
        id: item.resource_id,
        name: item.type,
        description: `Resource ID: ${item.resource_id}`,
        category: "Equipment",
        available: 1,
        total: 1,
        lab: item.lab_name,
      }));

      setResources(formattedResources);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources. Please try again.");
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle resource request
  const handleRequestResource = async (resourceId) => {
    setRequestingResource(resourceId);
    setRequestStatus(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/resource/request",
        {
          resourceId: resourceId,
          userId: currentUserId,
        }
      );

      // Show success notification
      setRequestStatus({
        type: "success",
        message: "Resource requested successfully!",
        details: `Request ID: ${response.data.requestId}, Status: ${response.data.status}`,
      });

      // Add the new request to the requests list
      const requestedResource = resources.find(
        (resource) => resource.id === resourceId
      );
      if (requestedResource) {
        const newRequest = {
          id: response.data.requestId,
          request_id: response.data.requestId,
          title: `Request for ${requestedResource.name}`,
          dates: new Date().toLocaleDateString(),
          resource: requestedResource.name,
          resourceId: resourceId,
          quantity: 1,
          status: "pending",
          lab: requestedResource.lab,
        };

        setUserRequests([newRequest, ...userRequests]);

        // Remove the requested resource from the available resources list
        setResources(
          resources.filter((resource) => resource.id !== resourceId)
        );
      }
    } catch (err) {
      console.error("Error requesting resource:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to request resource.",
        details: err.response?.data?.error || err.message,
      });
    } finally {
      setRequestingResource(null);
    }
  };

  // Handle resource release
  const handleReleaseResource = async (requestId) => {
    setReleasingResource(requestId);
    setRequestStatus(null);

    try {
      // Call the backend API to release the resource
      const response = await axios.patch(
        `http://localhost:3001/resource/${requestId}/release`
      );

      // Show success notification
      setRequestStatus({
        type: "success",
        message: "Resource released successfully!",
        details: response.data.message,
      });

      // Update requests list to remove the released resource
      setUserRequests(
        userRequests.filter((request) => request.id !== requestId)
      );
    } catch (err) {
      console.error("Error releasing resource:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to release resource.",
        details: err.response?.data?.message || "An error occurred.",
      });
    } finally {
      setReleasingResource(null);
    }
  };

  // Debounce function to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (labSearch || resourceSearch) {
        fetchResources();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [labSearch, resourceSearch]);

  // Clear request status notification after 5 seconds
  useEffect(() => {
    if (requestStatus) {
      const timer = setTimeout(() => {
        setRequestStatus(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  const handleLabSearch = (e) => {
    setLabSearch(e.target.value);
  };

  const handleResourceSearch = (e) => {
    setResourceSearch(e.target.value);
  };

  return (
    <div className="resource-allocation">
      <div className="header">
        <div>
          <h1>Resource Allocation</h1>
          <p>Manage resource requests and allocations for labs and projects.</p>
        </div>
      </div>

      <hr />

      {requestStatus && (
        <div className={`notification ${requestStatus.type}`}>
          <strong>{requestStatus.message}</strong>
          <p>{requestStatus.details}</p>
          <button
            className="close-notification"
            onClick={() => setRequestStatus(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="content">
        <div className="section">
          <div className="section-header">
            <h2>My Resource Requests</h2>
            <p>View your resource requests and manage approved resources.</p>
          </div>

          {requestsLoading ? (
            <div className="loading-indicator">
              <p>Loading your requests...</p>
            </div>
          ) : userRequests.length > 0 ? (
            <div className="request-cards">
              {userRequests.map((request) => (
                <div className="request-card" key={request.request_id}>
                  <div className="request-details">
                    <h3>{request.title}</h3>
                    <p>{request.dates}</p>
                    <div className="lab-tag">{request.lab}</div>
                    <div className="resource-tag">
                      {request.resource} ({request.quantity})
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {request.status === "approved" && (
                    <div className="action-buttons">
                      <button
                        className="release-button"
                        onClick={() =>
                          handleReleaseResource(request.id, request.resourceId)
                        }
                        disabled={releasingResource === request.id}
                      >
                        {releasingResource === request.id
                          ? "Releasing..."
                          : "Release Resource"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>You haven't requested any resources yet.</p>
              <p className="no-results-subtext">
                Search for resources below to make a request.
              </p>
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Available Resources</h2>
            <p>View and request available resources from the database.</p>
            <div className="search-section">
              <div className="search-label">
                <span>Find resources:</span>
              </div>
              <div className="search-container">
                <div className="search-group">
                  <label htmlFor="lab-search">Lab</label>
                  <input
                    id="lab-search"
                    type="text"
                    placeholder="Enter lab name"
                    value={labSearch}
                    onChange={handleLabSearch}
                    style={{ width: "220px", padding: "6px", fontSize: "14px" }}
                  />
                </div>
                <div className="search-group">
                  <label htmlFor="resource-search">Resource</label>
                  <input
                    id="resource-search"
                    type="text"
                    placeholder="Enter resource type"
                    value={resourceSearch}
                    onChange={handleResourceSearch}
                    style={{ width: "220px", padding: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-indicator">
              <p>Loading resources...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="resource-cards">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div className="resource-card" key={resource.id}>
                  <div className="resource-details">
                    <h3>{resource.name}</h3>
                    <p>{resource.description}</p>
                    <div className="lab-tag">{resource.lab}</div>
                    <div className="category-tag">Available</div>
                  </div>
                  <div className="resource-actions">
                    <div className="availability">
                      Resource ID: {resource.id}
                    </div>
                    <div className="action-buttons">
                      <button
                        className="request-button"
                        onClick={() => handleRequestResource(resource.id)}
                        disabled={requestingResource === resource.id}
                      >
                        {requestingResource === resource.id
                          ? "Requesting..."
                          : "Request"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>
                  {labSearch || resourceSearch
                    ? "No resources match your search criteria."
                    : "Enter search criteria to find resources."}
                </p>
                <p className="no-results-subtext">
                  {labSearch || resourceSearch
                    ? "Try adjusting your search terms or clear the fields."
                    : "Enter lab name and/or resource type to search."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;

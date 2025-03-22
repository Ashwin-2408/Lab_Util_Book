import React, { useState, useEffect } from "react";
import "./Resource_Allocation1.css"; // Reusing the same CSS
import axios from "axios";

const AdminResourceAllocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // New State for Adding Resources
  const [resourceType, setResourceType] = useState("");
  const [resourceLab, setResourceLab] = useState("");

  // Fetch all resource requests
  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/resource/requests"
      );
      console.log("Fetched all requests:", response.data); // Debugging

      // Transform the data to match component structure
      const formattedRequests = Array.isArray(response.data)
        ? transformResourceRequests(response.data)
        : [];

      setAllRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests. Please try again.");
      setAllRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to transform ResourceRequest objects to match component props
  const transformResourceRequests = (requests) => {
    if (!Array.isArray(requests)) {
      console.error("Expected array of requests, got:", requests);
      return [];
    }

    return requests
      .map((request) => {
        // Try to safely access all properties with fallbacks
        const requestId =
          getNestedProperty(request, "request_id") ||
          getNestedProperty(request, "dataValues.request_id") ||
          0;

        const userId =
          getNestedProperty(request, "user_id") ||
          getNestedProperty(request, "dataValues.user_id") ||
          "Unknown";

        const resourceId =
          getNestedProperty(request, "resource_id") ||
          getNestedProperty(request, "dataValues.resource_id") ||
          0;

        const status =
          getNestedProperty(request, "status") ||
          getNestedProperty(request, "dataValues.status") ||
          "pending";

        const createdDate =
          getNestedProperty(request, "createdAt") ||
          getNestedProperty(request, "dataValues.createdAt") ||
          new Date();

        // Extract resource and lab data safely
        let resourceName = "Unknown Resource";
        let labName = "Unknown Lab";

        const resource = getNestedProperty(request, "Resource");
        if (resource) {
          resourceName =
            getNestedProperty(resource, "type") ||
            getNestedProperty(resource, "dataValues.type") ||
            "Unknown Resource";

          const lab = getNestedProperty(resource, "lab");
          if (lab) {
            labName = getNestedProperty(lab, "name") || "Unknown Lab";
          }
        }

        // Build the transformed object
        return {
          id: requestId,
          request_id: requestId,
          userId: userId,
          resourceId: resourceId,
          title: `Request from User ${userId}`,
          dates: formatDate(createdDate),
          lab: labName,
          resource: resourceName,
          quantity: 1,
          status: status.toLowerCase(),
          createdAt: createdDate,
        };
      })
      .filter((item) => item !== null);
  };

  // Helper function to safely access nested properties
  const getNestedProperty = (obj, path) => {
    if (!obj) return undefined;

    const properties = path.split(".");
    let current = obj;

    for (let i = 0; i < properties.length; i++) {
      if (current === undefined || current === null) return undefined;
      current = current[properties[i]];
    }

    return current;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load all requests on component mount
  useEffect(() => {
    fetchAllRequests();
  }, []);

  // Handle request approval
  const handleApproveRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setRequestStatus(null);

    try {
      const response = await axios.patch(
        `http://localhost:3001/resource/${requestId}/approve`
      );

      // Show success notification
      setRequestStatus({
        type: "success",
        message: "Request approved successfully!",
        details:
          response.data.message ||
          "The resource has been allocated to the user.",
      });

      // Update the request in the list instead of refetching
      setAllRequests(
        allRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: "approved" }
            : request
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to approve request.",
        details: err.response?.data?.message || "An error occurred.",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Handle request rejection
  const handleRejectRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setRequestStatus(null);

    try {
      const response = await axios.post(
        `http://localhost:3001/resource/${requestId}/reject`
      );

      // Show success notification
      setRequestStatus({
        type: "success",
        message: "Request rejected.",
        details: response.data.message || "The request has been rejected.",
      });

      // Update the request in the list instead of refetching
      setAllRequests(
        allRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: "rejected" }
            : request
        )
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to reject request.",
        details: err.response?.data?.message || "An error occurred.",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Handle Adding New Resource
  const handleAddResource = async (e) => {
    e.preventDefault();
    console.log(resourceLab);
    console.log(resourceType);
    if (!resourceType || !resourceLab) {
      setRequestStatus({
        type: "error",
        message: "All fields are required!",
        details: "Please provide both resource type and lab name.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/resource/add_resource",
        {
          type: resourceType,
          lab_id: resourceLab,
          status: "Available",
        }
      );

      setRequestStatus({
        type: "success",
        message: "Resource added successfully!",
        details:
          response.data?.message ||
          "New resource has been added to the system.",
      });
      setResourceType("");
      setResourceLab("");

      // Refresh resource requests
      fetchAllRequests();
    } catch (err) {
      console.error("Error adding resource:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to add resource.",
        details:
          err.response?.data?.message ||
          "An error occurred while adding the resource.",
      });
    }
  };

  // Clear request status notification after 5 seconds
  useEffect(() => {
    if (requestStatus) {
      const timer = setTimeout(() => {
        setRequestStatus(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  // Filter requests based on status
  const filteredRequests =
    statusFilter === "all"
      ? allRequests
      : allRequests.filter((request) => request.status === statusFilter);

  console.log("Filtered Requests:", filteredRequests); // Debugging

  return (
    <div className="resource-allocation">
      <div className="header">
        <div>
          <h1>Resource Allocation Administration</h1>
          <p>Manage and process resource requests from users.</p>
        </div>
      </div>

      <hr />

      {requestStatus && (
        <div className={`notification ${requestStatus.type}`}>
          <strong>{requestStatus.message}</strong>
          {requestStatus.details && <p>{requestStatus.details}</p>}
          <button
            className="close-notification"
            onClick={() => setRequestStatus(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Add Resource Form */}
      <div className="add-resource-form">
        <h2>Add New Resource</h2>
        <form onSubmit={handleAddResource}>
          <input
            type="text"
            placeholder="Resource Type (e.g., Laptop, Projector)"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Lab Name"
            value={resourceLab}
            onChange={(e) => setResourceLab(e.target.value)}
            required
          />
          <button type="submit">Add Resource</button>
        </form>
      </div>

      <div className="content">
        <div className="section">
          <div className="section-header">
            <h2>Resource Requests</h2>
            <p>Review and manage resource requests from all users.</p>

            <div className="filter-controls">
              <span>Filter by status: </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="refresh-button" onClick={fetchAllRequests}>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-indicator">
              <p>Loading requests...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="request-cards admin-request-cards">
              {filteredRequests.map((request) => (
                <div
                  className="request-card"
                  key={request.request_id || request.id}
                >
                  <div className="request-details">
                    <h3>
                      {request.title || `Request from User ${request.userId}`}
                    </h3>
                    <p>
                      Requested:{" "}
                      {request.dates ||
                        new Date(request.createdAt).toLocaleString()}
                    </p>
                    <div className="user-tag">User ID: {request.userId}</div>
                    <div className="lab-tag">{request.lab}</div>
                    <div className="resource-tag">
                      {request.resource}{" "}
                      {request.quantity && `(x${request.quantity})`}
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {request.status.toLowerCase() === "pending" && (
                    <div className="action-buttons admin-actions">
                      <button
                        className="approve-button"
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={processingRequestId === request.id}
                      >
                        {processingRequestId === request.id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={processingRequestId === request.id}
                      >
                        {processingRequestId === request.id
                          ? "Processing..."
                          : "Reject"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>
                No {statusFilter !== "all" ? statusFilter : ""} requests found.
              </p>
              {statusFilter !== "all" && (
                <p className="no-results-subtext">
                  Try selecting a different status filter.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResourceAllocation;

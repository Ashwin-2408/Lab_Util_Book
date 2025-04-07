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
  
  // Add the new state variables for bulk functionality
  const [selectedResources, setSelectedResources] = useState({});
  const [availableResourceIds, setAvailableResourceIds] = useState([]);
  const [bulkResources, setBulkResources] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Function to transform ResourceRequest Sequelize objects to match component props
  const fetchUserBulkRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/bulk/user-requests', {
        userId: currentUserId
      });
      
      if (response.data && response.data.requests) {
        const formattedRequests = response.data.requests.map(request => ({
          id: request.request_id,
          request_id: request.request_id,
          title: `Bulk Request - ${request.resource_type}`,
          dates: new Date(request.createdAt || new Date()).toLocaleDateString(),
          resource: request.resource_type,
          quantity: request.quantity,
          status: request.status || 'pending',
          lab: request.lab_name,
          isBulk: true
        }));
        
        setUserRequests(formattedRequests);
      } else {
        setUserRequests([]);
      }
    } catch (error) {
      console.error('Error fetching bulk requests:', error);
      setError('Failed to load your requests');
      setUserRequests([]); // Set empty array on error
    } finally {
      setRequestsLoading(false);
    }
  };
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

  // New function to fetch bulk resources
  const fetchBulkResources = async () => {
    if (!labSearch && !resourceSearch) {
      setBulkResources([]);
      return;
    }
    
    setBulkLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/bulk/availability', {
        labName: labSearch,
        resourceType: resourceSearch
      });
      setBulkResources(response.data.resources);
    } catch (error) {
      setError(error.message);
      setBulkResources([]);
    } finally {
      setBulkLoading(false);
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

  // Handler functions for bulk resource selection
  const handleResourceSelect = (resourceId) => {
    setSelectedResources(prev => {
      if (resourceId in prev) {
        const updated = { ...prev };
        delete updated[resourceId];
        return updated;
      }
      return { ...prev, [resourceId]: 1 };
    });
  };
  
  const handleQuantityChange = (resourceId, quantity) => {
    const validQuantity = Math.max(1, parseInt(quantity) || 1);
    setSelectedResources(prev => ({
      ...prev,
      [resourceId]: validQuantity
    }));
  };
  
  const handleBulkRequest = async () => {
    if (Object.keys(selectedResources).length === 0) return;
    
    setRequestingResource('bulk');
    setRequestStatus(null);
  
    try {
      // Format the requests properly
      const requests = Object.entries(selectedResources).map(([availabilityId, quantity]) => ({
        availabilityId: parseInt(availabilityId),
        quantity: parseInt(quantity)
      }));
  
      const response = await axios.post(
        "http://localhost:3001/bulk/request",
        {
          userId: currentUserId,
          requests: requests  // Send as an array of objects
        }
      );
  
      if (response.data.success) {
        setRequestStatus({
          type: "success",
          message: "Bulk request successful",
          details: "Resources have been requested successfully"
        });
        setSelectedResources({});
        fetchBulkResources(); // Refresh the list
      }
    } catch (err) {
      console.error("Bulk request error:", err);
      setRequestStatus({
        type: "error",
        message: "Failed to request resources",
        details: err.response?.data?.error || err.message
      });
    } finally {
      setRequestingResource(null);
    }
  };

  // Load user requests on component mount
  // Replace the existing useEffect for loading requests
  useEffect(() => {
    fetchUserBulkRequests();
  }, []);

  // Debounce function to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (labSearch || resourceSearch) {
        fetchBulkResources();
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
                    {request.isBulk && (
                      <div className="bulk-badge">Bulk Request</div>
                    )}
                  </div>

                  {request.status === "approved" && !request.isBulk && (
                    <div className="action-buttons">
                      <button
                        className="release-button"
                        onClick={() => handleReleaseResource(request.id)}
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
            <h2>Available Bulk Resources</h2>
            <p>Search and request resources in bulk from labs.</p>
          </div>

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

          {loading || bulkLoading ? (
            <div className="loading-indicator">
              <p>Loading resources...</p>
            </div>
          ) : (
            <>
              <div className="resource-cards">
                {/* Bulk Resources Section */}
                {bulkResources.length > 0 && (
                  <div className="bulk-resources-section">
                    <h3>Bulk Resources</h3>
                    {bulkResources.map(resource => (
                      <div 
                        key={resource.availability_id} 
                        className={`resource-card ${resource.availability_id in selectedResources ? 'selected' : ''}`}
                      >
                        <div className="resource-select">
                          <input
                            type="checkbox"
                            checked={resource.availability_id in selectedResources}
                            onChange={() => handleResourceSelect(resource.availability_id)}
                          />
                          {resource.availability_id in selectedResources && (
                            <input
                              type="number"
                              min="1"
                              max={resource.available_quantity}
                              value={selectedResources[resource.availability_id] || 1}
                              onChange={(e) => handleQuantityChange(resource.availability_id, e.target.value)}
                              className="quantity-input"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                        <div className="resource-details">
                          <h3>{resource.resource_type}</h3>
                          <p>Lab: {resource.lab.lab_name}</p>
                          <div className="lab-tag">{resource.lab.lab_name}</div>
                          <div className="availability-tag">
                            Available: {resource.available_quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {Object.keys(selectedResources).length > 0 && (
                      <div className="bulk-action-buttons">
                        <button
                          className="request-button"
                          onClick={handleBulkRequest}
                          disabled={requestingResource === 'bulk'}
                        >
                          {requestingResource === 'bulk' ? 'Requesting...' : 'Request Selected Resources'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              
                {/* Individual Resources Section */}
                {resources.length > 0 && (
                  <div className="individual-resources-section">
                    <h3>Individual Resources</h3>
                    {resources.map((resource) => (
                      <div className="resource-card" key={resource.id}>
                        <div className="resource-details">
                          <h3>{resource.name}</h3>
                          <p>{resource.description}</p>
                          <div className="lab-tag">{resource.lab}</div>
                          <div className="availability-tag">
                            Available: {resource.available} / {resource.total}
                          </div>
                        </div>
                        <div className="action-buttons">
                          <button
                            className="request-button"
                            onClick={() => handleRequestResource(resource.id)}
                            disabled={requestingResource === resource.id}
                          >
                            {requestingResource === resource.id
                              ? "Requesting..."
                              : "Request Resource"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {resources.length === 0 && bulkResources.length === 0 && (
                  <div className="no-results">
                    <p>
                      {labSearch || resourceSearch
                        ? "No resources match your search criteria."
                        : "Enter search criteria to find resources."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
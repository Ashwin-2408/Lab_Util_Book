import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BulkResourceBooking = ({ currentUserId }) => {
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labSearch, setLabSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');

  const fetchBulkResources = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/bulk/availability', {
        labName: labSearch,
        resourceType: resourceSearch
      });
      setResources(response.data.resources);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (availabilityId, quantity) => {
    const resource = resources.find(r => r.availability_id === availabilityId);
    if (quantity > resource.available_quantity) {
      quantity = resource.available_quantity;
    }
    setSelectedResources(prev => ({
      ...prev,
      [availabilityId]: quantity
    }));
  };

  const handleBulkRequest = async () => {
    try {
      const requests = Object.entries(selectedResources).map(([availabilityId, quantity]) => ({
        availabilityId: parseInt(availabilityId),
        quantity
      }));

      await axios.post('http://localhost:3001/bulk/request', {
        userId: currentUserId,
        requests
      });

      // Clear selections and refresh resources
      setSelectedResources({});
      fetchBulkResources();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (labSearch || resourceSearch) {
        fetchBulkResources();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [labSearch, resourceSearch]);

  return (
    <div className="bulk-booking-section">
      <h2>Bulk Resource Booking</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by lab"
          value={labSearch}
          onChange={(e) => setLabSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by resource type"
          value={resourceSearch}
          onChange={(e) => setResourceSearch(e.target.value)}
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="bulk-resources">
        {resources.map(resource => (
          <div key={resource.availability_id} className="resource-card">
            <h3>{resource.resource_type}</h3>
            <p>Lab: {resource.lab.lab_name}</p>
            <p>Available: {resource.available_quantity}</p>
            <input
              type="number"
              min="0"
              max={resource.available_quantity}
              value={selectedResources[resource.availability_id] || 0}
              onChange={(e) => handleQuantityChange(resource.availability_id, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      {Object.keys(selectedResources).length > 0 && (
        <button 
          className="bulk-request-button"
          onClick={handleBulkRequest}
        >
          Submit Bulk Request
        </button>
      )}
    </div>
  );
};

export default BulkResourceBooking;
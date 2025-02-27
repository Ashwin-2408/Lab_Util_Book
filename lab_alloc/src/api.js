import axios from "axios";

const API_URL = "http://localhost:3001"; // Adjust as per your backend

export const getLabs = async () => {
  const response = await axios.get(`${API_URL}/labs`);
  return response.data;
};

export const getResources = async () => {
  const response = await axios.get(`${API_URL}/resources`);
  return response.data;
};

export const allocateResource = async (resourceId, labId) => {
  const response = await axios.put(
    `${API_URL}/resources/${resourceId}/allocate`,
    { lab_id: labId }
  );
  return response.data;
};

export const addLab = async (labData) => {
  const response = await axios.post(`${API_URL}/labs`, labData);
  return response.data;
};

export const addResource = async (resourceData) => {
  const response = await axios.post(`${API_URL}/resources`, resourceData);
  return response.data;
};

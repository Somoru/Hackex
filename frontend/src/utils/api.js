const API_URL = "http://localhost:5000/api";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
};

const API_URL = "http://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
};

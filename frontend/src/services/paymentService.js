import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

export const initiatePayment = async (amount) => {
  const { data } = await axios.post(`${API}/initiate`, { amount }, { withCredentials: true });
  return data;
};

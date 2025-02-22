import axios from "axios";



export const initiatePayment = async (amount) => {
  const { data } = await axios.post(`https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/auth/api/initiate`, { amount }, { withCredentials: true });
  return data;
};

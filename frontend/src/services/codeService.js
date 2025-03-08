import axios from "axios";

const API_BASE = "https://hackex-backend-gcdchvgghna9bef3.southindia-01.azurewebsites.net/api";

export const executeCode = async (language, code, questionId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.post(
    `${API_BASE}/code/execute`,
    { language, code, questionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const submitCode = async (language, code, questionId, challengeName) => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.post(
    `${API_BASE}/submissions/submit`,
    { language, code, questionId, challengeName, timeTakenSec: 10 },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const fetchNextQuestion = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await axios.get(`${API_BASE}/questions/next`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

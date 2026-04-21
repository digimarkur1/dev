import axios from "axios";

const API = axios.create({
  baseURL: "https://improved-barnacle-x566xjw49qw42ppp6-3000.app.github.dev",
});

// attach access token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// auto refresh when access token expires
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 403) {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await axios.post(
        "https://improved-barnacle-x566xjw49qw42ppp6-3000.app.github.dev/token",
        { token: refreshToken }
      );

      localStorage.setItem("accessToken", res.data.accessToken);

      error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

export default API;
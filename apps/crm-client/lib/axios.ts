import axios from "axios";
// import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => config);

// config holds the data like
//    {
//   url: "/users/profile",
//   method: "get",
//   baseURL: "https://api.example.com",
//   headers: {
//     Authorization: "Bearer OLD_ACCESS_TOKEN"
//   },
//   withCredentials: true,
//   timeout: 0,
//   data: undefined
// }

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 400 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/auth/new-refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


import { api } from "../api/axios";

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post("localhost:5262//Auth/login", data);
    return res.data;
  },

  register: async (formData: FormData) => {
    const res = await api.post("localhost:5262//Auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
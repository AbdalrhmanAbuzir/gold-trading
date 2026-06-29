import { api } from "../app/api/axios";

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((r) => r.data),

  register: (formData: FormData) =>
    api
      .post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),
};

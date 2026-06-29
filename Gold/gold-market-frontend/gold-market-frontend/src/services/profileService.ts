import { api } from "../app/api/axios";

export const profileService = {
  get: () => api.get("/profile").then((r) => r.data),

  update: (formData: FormData) =>
    api
      .put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  myProducts: () => api.get("/profile/my-products").then((r) => r.data),

  myOrders: () => api.get("/profile/my-orders").then((r) => r.data),

  mySales: () => api.get("/profile/my-sales").then((r) => r.data),
};

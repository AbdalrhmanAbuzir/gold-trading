import { api } from "../app/api/axios";

export const goldShopService = {
  getDashboard: () => api.get("/goldshop/dashboard").then((r) => r.data),

  getOrders: () => api.get("/goldshop/orders").then((r) => r.data),

  getReservedOrders: () =>
    api.get("/goldshop/orders/reserved").then((r) => r.data),

  getCompletedOrders: () =>
    api.get("/goldshop/orders/completed").then((r) => r.data),

  getOrderById: (id: string) =>
    api.get(`/goldshop/orders/${id}`).then((r) => r.data),
};

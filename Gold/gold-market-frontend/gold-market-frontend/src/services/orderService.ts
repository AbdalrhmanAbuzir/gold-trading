import { api } from "../app/api/axios";

export const orderService = {
  create: (data: { productId: string; goldShopId: string }) =>
    api.post("/Order/Create", data).then((r) => r.data),

  complete: (data: { orderId: string; notes?: string }, receiptFile?: File) => {
    const formData = new FormData();
    if (data.notes) formData.append("Notes", data.notes);
    if (receiptFile) formData.append("ReceiptImage", receiptFile);
    return api
      .post(`/Order/complete/${data.orderId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  cancel: (data: { orderId: string; reason?: string }) =>
    api.post(`/Order/cancel/${data.orderId}`, { reason: data.reason || "User cancellation" }).then((r) => r.data),

  getById: (id: string) =>
    api.get(`/Order/${id}`).then((r) => r.data),
};


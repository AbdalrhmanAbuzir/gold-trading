import { api } from "../app/api/axios";

export const notificationService = {
  getMyNotifications: () =>
    api.get("/notification/my-notifications").then((r) => r.data),

  markAsRead: (id: string) =>
    api.post(`/notification/mark-as-read/${id}`).then((r) => r.data),
};

import { api } from "../../app/api/axios";

export const adminService = {
  getDashboard: async () => {
    const res = await api.get("/Admin/dashboard");
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get("/Admin/users");
    return res.data.map((u: any) => ({
      ...u,
      verificationStatus:
        u.verificationStatus === 1 ? "Pending" :
        u.verificationStatus === 2 ? "Approved" :
        u.verificationStatus === 3 ? "Rejected" :
        u.verificationStatus
    }));
  },

  getPendingUsers: async () => {
    const res = await api.get("/Admin/pending-users");
    return res.data;
  },

  getUserById: async (id: string) => {
    const res = await api.get(`/Admin/user/${id}`);
    return res.data;
  },

  verifyUser: async (dto: { userId: string; isApproved: boolean; reason?: string }) => {
    const res = await api.post("/Admin/verify-user", dto);
    return res.data;
  },

  assignRole: async (dto: { userId: string; roleId: number }) => {
    const res = await api.post("/Admin/assign-role", dto);
    return res.data;
  },

  blockUser: async (dto: { userId: string; days: number }) => {
    const res = await api.post("/Admin/block-user", dto);
    return res.data;
  },

  unblockUser: async (userId: string) => {
    // Note: unblock-user expects userId query parameter
    const res = await api.post(`/Admin/unblock-user?userId=${userId}`);
    return res.data;
  },

  getRoles: async () => {
    const res = await api.get("/Admin/roles");
    return res.data;
  },

  getGoldShops: async () => {
    const res = await api.get("/Admin/goldshops");
    return res.data;
  },

  activateGoldShop: async (dto: { userId: string; goldShopId: string }) => {
    const res = await api.post("/Admin/activate-goldshop", dto);
    return res.data;
  },

  getOrders: async () => {
    const res = await api.get("/Admin/orders");
    return res.data;
  }
};
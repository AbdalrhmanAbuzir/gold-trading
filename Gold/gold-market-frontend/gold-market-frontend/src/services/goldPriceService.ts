import { api } from "../app/api/axios";

export const goldPriceService = {
  getLatest: () => api.get("/GoldPrice").then((r) => r.data),
};

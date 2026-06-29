import { api } from "../app/api/axios";
import type { PaginationParams } from "../types";

export const productService = {
  getAll: (params?: any) => {
    const queryParams: any = {};
    if (params) {
      if (params.page !== undefined) queryParams.PageNumber = params.page;
      if (params.pageSize !== undefined) queryParams.PageSize = params.pageSize;
      if (params.search !== undefined) queryParams.Search = params.search;
      if (params.categoryId !== undefined) queryParams.CategoryId = params.categoryId;
      if (params.karat !== undefined) queryParams.Karat = params.karat;
      if (params.sellerId !== undefined) queryParams.SellerId = params.sellerId;
      if (params.minPrice !== undefined) queryParams.MinPrice = params.minPrice;
      if (params.maxPrice !== undefined) queryParams.MaxPrice = params.maxPrice;
      if (params.sortBy !== undefined) queryParams.SortBy = params.sortBy;
    }
    return api.get("/product", { params: queryParams }).then((r) => r.data);
  },

  getById: (id: string) =>
    api.get(`/product/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api
      .post("/product/Create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api
      .put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/product/${id}`).then((r) => r.data),
};

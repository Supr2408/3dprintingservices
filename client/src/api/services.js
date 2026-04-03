import http from "./http";

export const getProducts = async (category) => {
  const response = await http.get("/products", {
    params: category && category !== "All" ? { category } : undefined
  });
  return response.data;
};

export const submitPredefinedOrder = async (payload) => {
  const response = await http.post("/orders/predefined", payload);
  return response.data;
};

export const submitCustomOrder = async (formData) => {
  const response = await http.post("/orders/custom", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const getAdminOrders = async (token) => {
  const response = await http.get("/admin/orders", {
    headers: { "x-admin-token": token }
  });
  return response.data;
};

export const updateAdminOrderStatus = async (id, status, token) => {
  const response = await http.patch(
    `/admin/orders/${id}/status`,
    { status },
    { headers: { "x-admin-token": token } }
  );
  return response.data;
};

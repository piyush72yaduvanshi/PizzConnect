import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: () => api.get('/products/all'),
  getById: (id) => api.get(`/products/id/${id}`),
  getByCategory: (category) => api.get('/products/category', { params: { category } }),
  getByName: (name) => api.get('/products/name', { params: { name } }),
  upload: (data) => api.post('/products/upload', data),
  update: (id, data) => api.put(`/products/update/${id}`, data),
  delete: (id) => api.delete(`/products/delete/${id}`),
  toggleAvailability: (id) => api.patch(`/products/toggle-availability/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (data) => api.put('/cart/update', data),
  removeItem: (data) => api.delete('/cart/remove', { data }),
  clearCart: () => api.delete('/cart/clear'),
  checkout: (deliveryAddress) => api.post('/cart/checkout', { deliveryAddress }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  getMyOrders: () => api.get('/orders'),
  getAllOrders: () => api.get('/orders/all'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrdersByUserId: (userId) => api.get(`/orders/user/${userId}`),
  createOrder: (data) => api.post('/orders', data),
  acceptOrder: (id) => api.put(`/orders/${id}/accept`),
  rejectOrder: (id) => api.put(`/orders/${id}/reject`),
  assignDelivery: (id, deliveryPersonId) => api.put(`/orders/${id}/assign`, { deliveryPersonId }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export default api;

import api from './api'

export const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders'),
  getAllOrders: () => api.get('/admin/orders'),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
}

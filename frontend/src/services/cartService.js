import api from './api'

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}?quantity=${quantity}`),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
}

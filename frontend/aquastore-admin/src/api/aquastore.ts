import { apiRequest } from './client.ts'
import type { Address, Brand, Category, CreateOrderRequest, Customer, Order, Product } from './types.ts'

export const brandsApi = {
  list: () => apiRequest<Brand[]>('/api/Brands'),
  create: (body: { name: string; description: string | null }) =>
    apiRequest<Brand>('/api/Brands', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { id: string; name: string; description: string | null }) =>
    apiRequest<Brand>(`/api/Brands/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
}

export const categoriesApi = {
  list: () => apiRequest<Category[]>('/api/Categories'),
  create: (body: { name: string; description: string | null }) =>
    apiRequest<Category>('/api/Categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: { id: string; name: string; description: string | null }) =>
    apiRequest<Category>(`/api/Categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
}

export const productsApi = {
  list: () => apiRequest<Product[]>('/api/Products'),
  create: (body: Omit<Product, 'id'>) =>
    apiRequest<Product>('/api/Products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Product) =>
    apiRequest<string>(`/api/Products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
}

export const customersApi = {
  create: (body: { firstName: string; lastName: string; email: string; phone: string | null }) =>
    apiRequest<Customer>('/api/customers', { method: 'POST', body: JSON.stringify(body) }),
  getById: (id: string) => apiRequest<Customer>(`/api/customers/${id}`),
  listAddresses: (customerId: string) => apiRequest<Address[]>(`/api/customers/${customerId}/addresses`),
  createAddress: (customerId: string, body: Omit<Address, 'id' | 'customerId'>) =>
    apiRequest<Address>(`/api/customers/${customerId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateAddress: (customerId: string, addressId: string, body: Omit<Address, 'customerId'>) =>
    apiRequest<Address>(`/api/customers/${customerId}/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...body, id: addressId }),
    }),
}

export const ordersApi = {
  list: () => apiRequest<Order[]>('/api/Orders'),
  getById: (id: string) => apiRequest<Order>(`/api/Orders/${id}`),
  create: (body: CreateOrderRequest) =>
    apiRequest<Order>('/api/Orders', { method: 'POST', body: JSON.stringify(body) }),
}

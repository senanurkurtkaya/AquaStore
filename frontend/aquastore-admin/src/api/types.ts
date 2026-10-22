export type Brand = {
  id: string
  name: string
  description: string | null
}

export type Category = {
  id: string
  name: string
  description: string | null
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  categoryId: string
  brandId: string
}

export type Customer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

export type Address = {
  id: string
  customerId: string
  title: string
  country: string
  city: string
  district: string
  street: string
  postalCode: string
  description: string
}

export type OrderLine = {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: string
  customerId: string
  orderDate: string
  totalAmount: number
  deliveryAddressId: string
  invoiceAddressId: string
  status: number
  invoiceType: number
  items: OrderLine[]
}

export type CreateOrderItem = {
  productId: string
  quantity: number
}

export type CreateOrderRequest = {
  customerId: string
  deliveryAddressId: string
  invoiceAddressId: string
  invoiceType: number
  orderItems: CreateOrderItem[]
}

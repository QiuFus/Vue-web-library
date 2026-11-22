export interface OrderItem {
  itemId: number
  bookId: number
  title: string
  cover: string
  price: string | number
  quantity: number
}

export interface Order {
  orderId: number
  orderNo: string
  totalAmount: string | number
  status: string
  createdAt: string
  firstCover?: string
  itemCount?: number
}

export interface OrderDetail extends Order {
  items: OrderItem[]
}
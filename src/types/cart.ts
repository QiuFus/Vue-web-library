export interface CartItem {
  cartId: number
  quantity: number
  id: number          // 图书 ID
  title: string
  cover: string
  author: string
  price: string | number
  stock: number
}
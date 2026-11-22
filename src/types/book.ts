export interface Book {
  id: number
  title: string
  cover: string
  author: string
  description?: string
  price: string | number
  stock: number
  category?: string
  commentCount: number
  favoriteCount: number
  publishTime: string
  isFavorited: boolean
}

export interface BookDetail extends Book {
  publisher?: string
  isbn?: string
  pages?: number
  binding?: string
  language?: string
  intro?: string
  catalog?: string
}

export interface Comment {
  id: number
  content: string
  rating: number
  likeCount: number
  createdAt: string
  userId: number
  nickname: string
  avatarUrl?: string
}
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080',   
  timeout: 10000,
})

// 请求拦截器：每个请求自动带上 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理 401（token 过期）
request.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth' 
    }
    return Promise.reject(err)
  }
)

export default request
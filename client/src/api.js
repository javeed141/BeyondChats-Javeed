import axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: base
})

export default api

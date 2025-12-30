import axios from "axios"

const api = axios.create({
  baseURL: "https://beyondchats-javeed.onrender.com/api/",
})

export default api

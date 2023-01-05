import Axios from "axios";

export const api = Axios.create({
  // baseURL: "http://localhost:5000/",
  baseURL: "https://pleiades-testing-store.myshopify.com/",
  timeout: 8000,
})

import axios from "axios";

const API = axios.create({
  baseURL: "https://communityhub-tsfk.onrender.com/api"
});

export default API;
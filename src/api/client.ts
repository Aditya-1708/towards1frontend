import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.9:8000", // Use 10.0.2.2 for Android Emulator
});

export default api;

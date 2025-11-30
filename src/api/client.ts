import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Use 10.0.2.2 for Android Emulator
});

export default api;

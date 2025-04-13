import axios from 'axios';

const api = axios.create({


  baseURL: "https://api.aievaluate.xyz/",
  
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
import axios from 'axios';

const api = axios.create({

  //baseURL: "http://localhost:8000",
  baseURL: "http://ec2-13-233-2-51.ap-south-1.compute.amazonaws.com",
  
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
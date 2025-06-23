// we are creating instance of the axios 

import axios from "axios"

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true, // cookies ko attach krdena 
    headers: {
        "Content-Type": "application/json" // data tyep object type ka hoga
        
    }
})

export default axiosClient
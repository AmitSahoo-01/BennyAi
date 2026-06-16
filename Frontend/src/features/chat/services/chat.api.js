import axios from "axios";

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const  sendMessage = async ({message,chatId}) => {
    try{
        const response = await api.post("/api/chats/message",{message,chat:chatId});
        return response.data;
    }catch(err){
        console.error("Message can not be featched",err);
        throw err;  
    }
}

export const getChats = async () =>{
    try{
        const response = await api.get("/api/chats");
        return response.data;
    }catch(err){
        console.error("chats can not be featched",err);
        throw err;  
    }
}

export const getMessages = async (chatId)=>{
    try{
        const response = await api.get(`/api/chats/${chatId}/messages`);
        return response.data;
    }catch(err){
        console.error("Messages can not be featched",err);
        throw err;  
    }
}

export const deleteMessage = async (chatId) =>{
    try{
        const  response = await api.delete(`/api/chats/delete/${chatId}`);
        return response.data;
    }catch(err){
        console.error("Message can not be deleted",err);
        throw err;  
    }
}
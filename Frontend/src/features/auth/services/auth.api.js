import axios from 'axios';

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials: true,
});


export async function register({email,username,password}){
    try {
        const response = await api.post("auth/register",{
            email,
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

export async function login({email,password}){
    try{
        const response = await api.post("auth/login",{
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;        
    }       
};

export async function getMe(){
    try{
        const response = await api.get("/auth/get-me");
        return response.data;
    }catch(error){
        console.error("Error occur during fetching data",error);
        throw error;
    }
};
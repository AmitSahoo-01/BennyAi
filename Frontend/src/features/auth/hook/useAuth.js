import {useDispatch} from 'react-redux';
// These are the api which are connected to Backend.
import { register,login,getMe } from '../services/auth.api';
// These are the user satets .
import { setUser,setLoading,setError } from '../auth.slice';

export function useAuth(){
    const dispatch = useDispatch();

    async function handleRegister({email,username,password}) {
        try{
            dispatch(setLoading(true));
            const data = await register({
                email,
                username,
                password
            });
        }catch(error){
            dispatch(setError(error.response?.message || "Registration Failed"));
        }finally{
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({email,password}){
        try{
            dispatch(setLoading(true));
            const data = await login({
                email,
                password
            });
            dispatch(setUser(data.user));
        }catch(err){
            dispatch(setError(error.response?.message || "login Failed"));
        }finally{
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe(){
        try{
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        }catch(err){
            dispatch(setError(error.response?.message || "user dat not found."));
        }finally{
            dispatch(setLoading(false));
        }
    }

    return{
        handleRegister,
        handleLogin,
        handleGetMe
    }

}
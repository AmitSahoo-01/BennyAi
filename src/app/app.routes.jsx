import {createBrowserRouter } from 'react-router-dom';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register';

export const authRouter = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }
])
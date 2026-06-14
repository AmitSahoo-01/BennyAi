import {createBrowserRouter } from 'react-router-dom';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import Protected from '../features/auth/components/Protected.jsx';
import { Navigate } from 'react-router-dom';
import Dashboard from '../features/chat/pages/Dashboard.jsx';

export const authRouter = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },{
        path:"/",
        element:<Protected>
                    <Dashboard />
                </Protected>
    },{
        path:"*",
        element:<Navigate to="/" replace/>
    }
])
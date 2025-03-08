import React from 'react';
import { Login } from '../features';

const LoginPage: React.FC = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">Login</h1>
            <Login />
        </div>
    </div>
);

export default LoginPage;
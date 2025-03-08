import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Button } from '../components';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(login({ user: username, token: 'fake-token' }));
    };

    return (
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg rounded-xl max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
            <form className="flex flex-col space-y-4 w-full">
                {/* Input Field */}
                <div className="relative group">
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full px-5 py-3 bg-white text-gray-700 rounded-full shadow-inner border-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 placeholder-gray-400 transition-all duration-200 ease-in-out"
                    />
                </div>

                {/* Login Button */}
                <Button
                    text="Login"
                    onClick={handleLogin}
                    color="indigo"
                    size="md"
                    className="w-full py-3"
                />
            </form>
        </div>
    )
}

export default LoginForm
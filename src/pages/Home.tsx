import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome {user}!</h1>
            {!user && <p className="text-lg text-gray-700 mb-6">
                Log in to manage your todos or explore the app.
            </p>}
            {user ? <Link
                to="/todos"
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
                Go to Todo
            </Link>
                :
                <Link
                    to="/login"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                    Go to Login
                </Link>}
        </div>
    );
};

export default Home;
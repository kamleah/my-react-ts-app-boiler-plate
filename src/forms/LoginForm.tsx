import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Eye, EyeSlash, Danger } from 'iconsax-react';
import { LoadingButton } from '../components';
import axios from 'axios';
import { apiEndPoints } from '../services/apiEndPoints';
import { useDispatch } from 'react-redux';
import { loggedUserDetails, login } from '../features/auth/authSlice';

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            axios.post(apiEndPoints.login, data).then((response) => {
                dispatch(loggedUserDetails({ userDetails: response.data.data }));
                dispatch(login({ user: response.data.data.email, access: response.data.data.access, refresh: response.data.data.refresh }));
            });
            console.log('Form submitted:', data);
        } catch (error) {
            console.error('Login error:', error);
            setServerError('Failed to login. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-6 bg-white shadow-md rounded-xl p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Sign in to your account</h2>

                {serverError && (
                    <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 text-red-700 text-sm">
                        <Danger size={20} className="text-red-500" />
                        <span>{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Email address is invalid',
                                },
                            })}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${errors.email ? 'border-red-400' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must have at least 6 characters',
                                    },
                                })}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm pr-10 ${errors.password ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <LoadingButton
                        isLoading={isLoading}
                        type="submit"
                        text={isLoading ? 'Signing in...' : 'Sign In'}
                        activeClassName="bg-blue-600 hover:bg-blue-700"
                        disabledClassName="bg-gray-400 cursor-not-allowed"
                    />

                </form>
            </div>
        </div>
    );
};

export default LoginForm;

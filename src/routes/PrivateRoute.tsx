import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PrivateRoute: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);
    console.log("isAuthenticated--2", isAuthenticated);
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PublicRouteProps {
    restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ restricted = false }) => {
    const isAuthenticated = useSelector((state: RootState) => !!state.auth.user);

    return isAuthenticated && restricted ? (
        <Navigate to="/todos" replace />
    ) : (
        <Outlet />
    );
};

export default PublicRoute;
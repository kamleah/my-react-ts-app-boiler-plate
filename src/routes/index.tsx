import { Navigate, Route, RouteObject } from 'react-router-dom';
import { Home, LoginPage, TodoPage } from '../pages';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <Home /> },
];

export const restrictedPublicRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
];

export const privateRoutes: RouteObject[] = [
  { path: '/todos', element: <TodoPage /> },
  // Add more private routes here
];

export const routes = (
  <>
    <Route element={<PublicRoute />}>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Route>
    <Route element={<PublicRoute restricted />}>
      {restrictedPublicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Route>
    <Route element={<PrivateRoute />}>
      {privateRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);
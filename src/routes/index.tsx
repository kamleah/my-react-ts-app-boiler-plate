import { Navigate, Route, RouteObject } from 'react-router-dom';
import { CardImage, GradientBackground, Home, LoginPage, RemoveBackground, TemplateSelector, TodoPage, UploadImage, UploadTemplate } from '../pages';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import PrivateLayout from '../layout/PrivateLayout';
import ImageGenerator from '../pages/ImageGenerator';
import WordsCollections from '../pages/WordsCollections';
import HeaderGraphicCreator from '../pages/HeaderGraphicCreator';
import Categories from '../pages/Categories';
import Authentication from '../features/auth/Authentication';
import Header from '../components/header/Header';
import Unauthorized from '../features/auth/Unauthorized';

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <Home /> },
];

export const restrictedPublicRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
];

export const privateRoutes: RouteObject[] = [
  { path: '/todos', element: <TodoPage /> },
  { path: '/rb', element: <RemoveBackground /> },
  { path: '/gbg', element: <GradientBackground /> },
  { path: '/card-image', element: <CardImage /> },
  { path: '/upload-image', element: <UploadImage /> },
  { path: '/upload-template', element: <UploadTemplate /> },
  { path: '/template-selector', element: <TemplateSelector /> },
  { path: '/image-generator', element: <ImageGenerator /> },
  { path: '/keywords-collections', element: <WordsCollections /> },
  { path: '/header-graphic-creator', element: <HeaderGraphicCreator /> },
  { path: '/word-categories', element: <Categories /> },
];

export const autheticationRoutes: RouteObject[] = [
  { path: '/', element: <Authentication /> },
  { path: '/authenticate', element: <Authentication /> },
  { path: '/header-graphic-creator', element: <HeaderGraphicCreator /> },
  { path: '/unauthorized', element: <Unauthorized /> },
];
export const routes = (
  <>
    {/* <Route element={<PublicRoute />}>
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
      <Route element={<PrivateLayout />}>
        {privateRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Route> */}

    <Route element={<PublicRoute />}>
      <Route element={<PrivateLayout />}>
        {autheticationRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </>
);
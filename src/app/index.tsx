/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';
import { Login } from './pages/Login/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { Layout } from './pages/Layout/Loadable';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalSlice } from './slice';
import { auth } from 'utils/helper';
import { isLogged } from './slice/selector';
import { useTranslation } from 'react-i18next';
import { appRoutes, corepulseRoot } from 'app/routesConfig';
import { ObjectPage } from './pages/Object/Loadable';
import { ObjectDetail } from './pages/ObjectDetail';
import { AccessDenied } from './pages/AccessDenied/Loadable';
import { Dashboard } from './pages/Dashboard/Loadable';
import usePermission from 'utils/hooks/usePermission';
import { PageDetail } from './pages/PageDetail/Loadable';
import { Pages } from './pages/Pages/Loadable';
import { MediaLibrary } from './pages/MediaLibrary/Loadable';
import { MediaLibraryDetail } from './pages/MediaLibraryDetail/Loadable';

function RouteWithPermission({
  type,
  action,
  element,
  routeKey,
}: {
  type: 'documents' | 'objects' | 'assets' | 'others';
  action: string;
  element: JSX.Element;
  routeKey?: string | number;
}) {
  const { object } = useParams<{ object: string }>();
  const convertKey = type === 'objects' ? object : routeKey;

  const hasAccess = usePermission(type, convertKey, action);
  return hasAccess ? element : <AccessDenied />;
}

export function App() {
  const { i18n } = useTranslation();
  const { actions } = useGlobalSlice();
  const dispatch = useDispatch();
  const isLoged = useSelector(isLogged);
  useEffect(() => {
    if (auth()) {
      dispatch(actions.loginSuccesses());
    }
  }, [actions, dispatch]);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Corepluse application"
        defaultTitle="Corepluse"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Corepluse application" />
      </Helmet>

      <Routes>
        <>
          <Route
            path={`${corepulseRoot}/`}
            element={
              <ProtectedRoute
                auth={isLoged || auth()}
                navigate={`${corepulseRoot}/login`}
              >
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path={`${corepulseRoot}/`} element={<Dashboard />} />
            {appRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RouteWithPermission
                    type={route.type}
                    routeKey={route.key}
                    action={route.action}
                    element={route.element}
                  />
                }
              />
            ))}
            <Route
              key={'media-library'}
              path={`${corepulseRoot}/media-library`}
              element={<MediaLibrary />}
            />
            <Route
              key={'media-library-detail'}
              path={`${corepulseRoot}/media-library/detail`}
              element={<MediaLibraryDetail />}
            />
            <Route
              key={'pages'}
              path={`${corepulseRoot}/pages`}
              element={<Pages />}
            />
            <Route
              key={'media-library'}
              path={`${corepulseRoot}/pages/detail`}
              element={<PageDetail />}
            />
            <Route
              path={`${corepulseRoot}/:object`}
              element={
                <RouteWithPermission
                  type="objects"
                  action="listing"
                  routeKey={''}
                  element={<ObjectPage />}
                />
              }
            />
            <Route
              path={`${corepulseRoot}/:object/detail`}
              element={
                <RouteWithPermission
                  type="objects"
                  action="view"
                  routeKey={''}
                  element={<ObjectDetail />}
                />
              }
            />
          </Route>
          <Route
            path={`${corepulseRoot}/login`}
            element={
              <ProtectedRoute auth={!auth()} navigate={`${corepulseRoot}/`}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </>
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
}

import ErrorBoundary from 'app/components/error-boundary/error-boundary';
import Header from 'app/components/header/header';
import Loader from 'app/components/loader/loader';
// import Loader from 'app/components/loader/loader';
// import Header from 'app/containers/header/header';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './private-route';
import { Routes } from './routes';

const LandingPage = lazy(() => import('app/pages/landing-page/landing-page'));
const SignInPage = lazy(() => import('app/pages/sign-in-page/sign-in-page'));
const SignUpPage = lazy(() => import('app/pages/sign-up-page/sign-up-page'));
const MainPage = lazy(() => import('app/pages/main-page/main-page'));
const ArticlesPage = lazy(
  () => import('app/pages/articles-page/articles-page'),
);
const ProfilePage = lazy(() => import('app/pages/profile-page/profile-page'));
const SingleArticlePage = lazy(
  () => import('app/pages/single-article-page/single-article-page'),
);
const AdminStaffPage = lazy(
  () => import('app/pages/admin-staff-page/admin-staff-page'),
);
const StaffDetailsPage = lazy(
  () => import('app/pages/staff-details-page/staff-details-page'),
);
const AdminArticlesPage = lazy(
  () => import('app/pages/admin-articles-page/admin-articles-page'),
);
const AdminArticlesEditor = lazy(
  () => import('app/pages/admin-articles-editor/admin-articles-editor'),
);
const AdminCategoriesPage = lazy(
  () => import('app/pages/admin-categories/admin-categories-page'),
);
const NotFoundPage = lazy(
  () => import('app/pages/not-found-page/not-found-page'),
);
const RestorePassword = lazy(
  () => import('app/pages/restore-password/restore-password'),
);

const RouterComponent = (): JSX.Element => (
  <Router>
    <ErrorBoundary>
      <Header />
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path={Routes.SIGN_IN} component={SignInPage} />
          <Route exact path={Routes.SIGN_UP} component={SignUpPage} />
          <Route exact path={Routes.LANDING} component={LandingPage} />
          <Route
            exact
            path={Routes.RESTORE_PASSWORD}
            component={RestorePassword}
          />

          <PrivateRoute exact path={Routes.MAIN} component={MainPage} />

          <PrivateRoute
            exact
            path={Routes.ARTICLES_VIEW}
            component={ArticlesPage}
          />
          <PrivateRoute exact path={Routes.PROFILE} component={ProfilePage} />
          <PrivateRoute
            exact
            path={Routes.ARTICLE_PAGE}
            component={SingleArticlePage}
          />

          {/* admin */}
          <PrivateRoute
            exact
            adminRoute
            path={Routes.ADMIN_STAFF}
            component={AdminStaffPage}
          />
          <PrivateRoute
            exact
            adminRoute
            path={Routes.ADMIN_STAFF_DETAILS}
            component={StaffDetailsPage}
          />
          <PrivateRoute
            exact
            adminRoute
            path={Routes.ADMIN_ARTICLES}
            component={AdminArticlesPage}
          />
          <PrivateRoute
            exact
            adminRoute
            path={Routes.ADMIN_ARTICLES_EDITOR}
            component={AdminArticlesEditor}
          />
          <PrivateRoute
            exact
            adminRoute
            path={Routes.ADMIN_CATEGORIES}
            component={AdminCategoriesPage}
          />

          <Route exact path={Routes.NOT_FOUND} component={NotFoundPage} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  </Router>
);

export default RouterComponent;

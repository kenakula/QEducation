import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Routes } from 'app/routes/routes';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from 'app/stores/auth-store/auth-store';
import { AuthStates } from 'app/constants/auth-state';
import { Loader } from 'app/components/loader';

interface Props {
  exact: boolean;
  path: string;
  component: any;
  adminRoute?: boolean;
}

const PrivateRoute = observer((props: Props): JSX.Element => {
  const { component: Component, adminRoute, ...rest } = props;

  const { authState, userInfo } = useAuthStore();

  return (
    <Route
      {...rest}
      render={renderProps => {
        switch (authState) {
          case AuthStates.Processing:
            return <Loader />;
          case AuthStates.Authorized:
            if (!adminRoute) {
              return <Component {...renderProps} />;
            }

            if (userInfo) {
              if (userInfo.isSuperAdmin) {
                return <Component {...renderProps} />;
              }

              return <div>no rights</div>;
            }

            return <Loader />;
          default:
            return <Redirect to={Routes.SIGN_IN} />;
        }
      }}
    />
  );
});

export default PrivateRoute;

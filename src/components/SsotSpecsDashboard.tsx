import { Fragment, h } from 'preact';
import { Route, type RouteProps, Router, route } from 'preact-router';
import { useEffect } from 'preact/hooks';

import { DeviceDetails } from '@/components/DeviceDetails';
import { DeviceTable } from '@/components/DeviceTable';
import { Header } from '@/components/Header';
import { RouteError } from '@/components/RouteError';
import { Callback } from '@/components/login/Callback';
import { Login } from '@/components/login/Login';
import { isLoggedIn, logout } from '@/data/auth';

function ProtectedRoute<T>(props: RouteProps<T> & Partial<T>) {
  // useEffect is used because calling route() in the render function
  // does not work.
  useEffect(() => {
    if (!isLoggedIn.value) {
      route('/login', true);
    }
  }, []);

  return isLoggedIn.value ? <Route {...props} /> : null;
}

export function SsotSpecsDashboard() {
  return (
    <>
      <Header
        onLogout={() => {
          logout();
          route('/login');
        }}
        title="SSOT Dashboard"
      />
      <div class="m-4">
        <Router>
          <ProtectedRoute path="/" component={DeviceTable} />
          <ProtectedRoute path="/device/:uuid" component={DeviceDetails} />
          <Route path="/login" component={Login} />
          <Route path="/callback" component={Callback} />
          <Route default component={RouteError} />
        </Router>
      </div>
    </>
  );
}

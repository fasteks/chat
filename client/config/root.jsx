import React, { Suspense } from 'react'
import { Provider, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect, StaticRouter } from 'react-router-dom'

import store, { history } from '../redux'

import Home from '../components/home'
import LoginForm from '../components/login'
import NotFound from '../components/404'
import RegistrationForm from '../components/registration'

import Startup from './startup'

// import Admin from '../components/admin'
const Admin = React.lazy(() => import('../components/admin'))
const AdminSuspensed = () => (
  <Suspense fallback="Loading...">
    <Admin />
  </Suspense>
)

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth)

  const func = (props) =>
    !!auth.user && !!auth.token ? <Redirect to={{ pathname: '/chat' }} /> : <Component {...props} />
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)

  const func = (props) => {
    // if (!!auth.user && !!auth.token && auth.user.role?.includes('admin')) {
    //   return <Component {...props} />
    // }

    if (!!auth.user && !!auth.token) {
      return <Component {...props} />
    }

    return (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  }

  return <Route {...rest} render={func} />
}

const PrivateRouteAdmin = ({ component: Component, ...rest }) => {
  const auth = useSelector((s) => s.auth)

  const func = (props) => {
    if (!!auth.user && !!auth.token && auth.user.role?.includes('admin')) {
      return <Component {...props} />
    }

    return (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  }

  return <Route {...rest} render={func} />
}

const RouterSelector = (props) =>
  typeof window !== 'undefined' ? <ConnectedRouter {...props} /> : <StaticRouter {...props} />

const RootComponent = (props) => {
  return (
    <Provider store={store}>
      <RouterSelector history={history} location={props.location} context={props.context}>
        <Startup>
          <Switch>
            {/* <PrivateRouteAdmin exact path="/admin" component={Admin} /> */}
            <PrivateRouteAdmin exact path="/admin" component={AdminSuspensed} />
            <PrivateRoute exact path="/chat" component={Home} />
            <OnlyAnonymousRoute exact path="/login" component={LoginForm} />
            {/* <PrivateRoute exact path="/admin" component={Admin} /> */}
            <Route exact path="/registration" component={RegistrationForm} />
            <Route exact path="/" component={LoginForm} />
            <Route component={NotFound} />
          </Switch>
        </Startup>
      </RouterSelector>
    </Provider>
  )
}

export default RootComponent

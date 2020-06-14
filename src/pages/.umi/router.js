import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'D:/vi_security_protection/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/deploy',
    redirect: '/deploy/routeGuard',
    exact: true,
    _title: '路线警卫',
    _title_default: '路线警卫',
  },
  {
    path: '/',
    redirect: '/deploy',
    exact: true,
    _title: '路线警卫',
    _title_default: '路线警卫',
  },
  {
    path: '/',
    component: require('../../layouts').default,
    routes: [
      {
        path: '/deploy',
        component: require('../deploy').default,
        routes: [
          {
            path: '/deploy/routeGuard',
            component: require('../routeGuard').default,
            exact: true,
            _title: '路线警卫',
            _title_default: '路线警卫',
          },
          {
            component: () =>
              React.createElement(
                require('D:/vi_security_protection/node_modules/_umi-build-dev@1.17.1@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
            _title: '路线警卫',
            _title_default: '路线警卫',
          },
        ],
        _title: '路线警卫',
        _title_default: '路线警卫',
      },
      {
        path: '/fight',
        component: require('../fight').default,
        exact: true,
        _title: '路线警卫',
        _title_default: '路线警卫',
      },
      {
        component: () =>
          React.createElement(
            require('D:/vi_security_protection/node_modules/_umi-build-dev@1.17.1@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: '路线警卫',
        _title_default: '路线警卫',
      },
    ],
    _title: '路线警卫',
    _title_default: '路线警卫',
  },
  {
    component: () =>
      React.createElement(
        require('D:/vi_security_protection/node_modules/_umi-build-dev@1.17.1@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
    _title: '路线警卫',
    _title_default: '路线警卫',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}

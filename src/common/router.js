import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus &&
    menus.forEach(item => {
      if (item.children) {
        keys[item.path] = { ...item };
        keys = { ...keys, ...getFlatMenuData(item.children) };
      } else {
        keys[item.path] = { ...item };
      }
    });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/exception': {
      component: dynamicWrapper(app, [], () => import('../layouts/ExceptionLayout')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/user-detailed': {
      component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    },
    '/user/user-detailed/register': {
      component: dynamicWrapper(app, ['register'], () =>
        import('../routes/User/user-detailed/Register')
      ),
    },
    '/user/user-detailed/change-password': {
      component: dynamicWrapper(app, ['register'], () =>
        import('../routes/User/user-detailed/ChangePassword')
      ),
    },
    '/user/user-detailed/find-password': {
      component: dynamicWrapper(app, ['find'], () =>
        import('../routes/User/user-detailed/FindPassword')
      ),
    },
    '/manage/manage-user': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageUser')),
    },
    '/manage/manage-role': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageRole')),
    },
    '/manage/manage-authority': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageAuthority')),
    },
    '/manage/manage-company': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageCompany')),
    },
    '/manage/manage-log': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageLog')),
    },
    '/manage/manage-message': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/ManageMessage')),
    },
    '/manage/system-config': {
      component: dynamicWrapper(app, ['manage'], () => import('../routes/Manage/SystemConfig')),
    },
    '/publish/manage-resource': {
      component: dynamicWrapper(app, ['publish'], () => import('../routes/Publish/ManageResource')),
    },
    '/publish/details/resource-details': {
      component: dynamicWrapper(app, ['publish'], () =>
        import('../routes/Publish/ResourceDetails')
      ),
    },
    '/publish/details/product-details': {
      component: dynamicWrapper(app, ['publish'], () => import('../routes/Publish/ProductDetails')),
    },
    '/publish/manage-product': {
      component: dynamicWrapper(app, ['publish'], () => import('../routes/Publish/ManageProduct')),
    },
    '/publish/manage-document': {
      component: dynamicWrapper(app, ['publish'], () => import('../routes/Publish/ManageDocument')),
    },
    '/publish/manage-case': {
      component: dynamicWrapper(app, ['publish'], () => import('../routes/Publish/ManageCase')),
    },
    '/order/manage-order': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/ManageOrder')),
    },
    '/order/application-state': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/ApplicationState')),
    },
    '/order/manage-renew': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/ManageRenew')),
    },
    '/order/income-expenses': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/IncomeExpenses')),
    },
    '/order/work-list': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/WorkList')),
    },
    '/product': {
      component: dynamicWrapper(app, [], () => import('../layouts/Blank')),
    },
    '/product/index': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/Product/Index')),
    },

    '/console': {
      component: dynamicWrapper(app, ['console'], () => import('../routes/Console/Index')),
    },

    '/product/detail': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/Product/Detail')),
    },
    '/product/case': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/Product/Case')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};

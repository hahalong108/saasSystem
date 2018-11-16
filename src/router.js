import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);

  const UserLayout = routerData['/user'].component;
  const BlankLayout = routerData['/user/user-detailed'].component;
  const BasicLayout = routerData['/'].component;
  const Blank = routerData['/product'].component;
  const Exception = routerData['/exception'].component;

  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/user/user-detailed" component={BlankLayout} />
          <Route path="/product" component={Blank} />
          <Route path="/exception" component={Exception} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;

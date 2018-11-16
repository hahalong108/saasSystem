import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import { getRoutes } from '../utils/utils';
import logo from '../assets/img/logo.svg';
import styles from './BlankLayout.less';

class UserLayout extends React.PureComponent {
  render() {
    const { routerData, match } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>望海SAAS应用平台</span>
          </Link>
        </div>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
          <Redirect exact from="/user/user-detailed" to="/user/user-detailed/register" />
        </Switch>
      </div>
    );
  }
}

export default UserLayout;

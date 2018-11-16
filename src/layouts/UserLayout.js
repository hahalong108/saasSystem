import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
// import logo from '../assets/img/logo.svg';
import logo from '../assets/img/logo.png';
import floatImg from '../assets/img/floatImg.png';
import { getRoutes } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    www.viewhigh.com<br />
    北京东软望海科技有限公司版权所有<Icon type="copyright" />2003-2018
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '望海SAAS应用平台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 望海SAAS应用平台`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.floatImg}>
            <img alt="" className={styles.floatPic} src={floatImg} />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                {/* <Link to="/"> */}
                <img alt="logo" className={styles.logo} src={logo} />
                <div className={styles.saasName}>
                  <p className={styles.upTitle}>望海SAAS应用平台</p>
                  <p className={styles.downTitle}>SAAS application platform</p>
                </div>
                {/* <span className={styles.title}>SAAS应用平台</span> */}
                {/* </Link> */}
              </div>
            </div>
          </div>
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
            <Redirect exact from="/user" to="/user/login" />
          </Switch>
          <GlobalFooter copyright={copyright} /> {/*links={links}*/}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import { getRoutes } from '../utils/utils';

class ExceptionLayout extends React.PureComponent {
  render() {
    const { routerData, match } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </div>
    );
  }
}

export default ExceptionLayout;

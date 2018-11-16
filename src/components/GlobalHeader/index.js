import React, { Component } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { connect } from 'dva';
import { ipPath } from '../../common.js';
import UserCentre from '../UserCentre/UserCentre';

@connect(({ product, login, manage, user, }) => ({
  product,
  login,
  manage,
  currentUser: user.currentUser,
}))

export default class GlobalHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontStyle: {
        background: '',
        color: '',
      },
      productList: [],
      // productDetailInfo: {},
      productMenuVisible: false,
      userInforVisible: false,
      userData: {},
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'product/getAll',
    });
  }


  componentDidUpdate(nextProps) {
    if (this.props.currentUser.userId != nextProps.currentUser.userId) {
      let userId = this.props.currentUser.userId;
      let url =
        location.protocol === 'https:'
          ? 'wss://' + ipPath + '/saas-server/websocket/' + userId
          : 'ws://' + ipPath + '/saas-server/websocket/' + userId;
      this.ws = new WebSocket(url);
      this.ws.onmessage = e => {
        let messageData = JSON.parse(e.data);
        if (messageData.title == 'noticeTotal') {
          this.props.dispatch({
            type: 'user/changeNotifyCount',
            payload: messageData.content,
          });
        }
      };
    }
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
    // if (!!this.props.currentUser.userId&&(this.ws&&this.ws.readyState&&this.ws.readyState===1)) {
    //   this.ws.close();
    //   this.ws=null;
    // }
    if (!!this.props.currentUser.userId) {
      this.ws ? this.ws.close() : this.ws = null;
    }
  }

  componentWillUpdate = (nextProps) => {
    if (this.props.currentUser.userId != nextProps.currentUser.userId || (this.ws && this.ws.readyState && this.ws.readyState !== 1)) {
      let userId = nextProps.currentUser.userId;
      let url =
        location.protocol === 'https:'
          ? 'wss://' + ipPath + '/saas-server/websocket/' + userId
          : 'ws://' + ipPath + '/saas-server/websocket/' + userId;
      this.ws = new WebSocket(url);
      this.ws.onmessage = e => {
        let messageData = JSON.parse(e.data);
        if (messageData.title == 'noticeTotal') {
          this.props.dispatch({
            type: 'user/changeNotifyCount',
            payload: messageData.content,
          });
        }
      };
    }
  }
  componentWillReceiveProps(nextProps) {
    const next = nextProps.product;
    const manage = nextProps.manage;

    if (manage.returnType === 'getUserInfor' && manage.resultCode == 1000) {
      manage.returnType = '';
      this.setState({
        userData: manage.data[0],
      });
    }
    if (next.returnType === 'getAll' && next.resultCode == 1000) {
      this.setState({
        productList: next.data,
      });
    }
    // if (next.returnType === "getProduct" && next.resultCode == 1000) {
    //     this.setState({
    //         productDetailInfo: next.data,
    //     })
    // }
    next.returnType = '';
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  handleProductVisibleChange = flag => {
    this.setState({ productMenuVisible: flag });
  };

  // getProduct = (appId) => {
  //   this.props.dispatch({
  //       type: 'product/getProduct',
  //       payload: {
  //           appId: appId
  //       }
  //   });
  // }

  logout = () => {
    this.props.dispatch({
      type: 'login/logout',
    });
  };

  viewUserMessage = () => {
    this.setState({
      userInforVisible: true,
    });
    this.props.dispatch({
      type: 'manage/getUserInfor',
      payload: {
        searchParams: {
          userName: '',
          userType: 0,
          companyId: 0,
          state: 0,
          userPhone: '',
          userMail: this.props.currentUser.userMail,
        },
        page: {
          size: 1,
          curpage: 1,
        },
      },
    });
  }

  userInforOk = (e) => {
    this.setState({
      userInforVisible: false,
    });
  }

  userInforCancel = (e) => {
    this.setState({
      userInforVisible: false,
    });
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
    } = this.props;

    const { productList } = this.state;
    const productMenu = (
      <Menu>
        {productList.map((product, index) => {
          return (
            <Menu.Item key={product.appId}>
              <a href={`/product/detail?appId=${product.appId}`} target="_blank">
                {product.appName}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item>
          {/* <Link to="/manage/manage-user">用户管理</Link> */}
          <span
            title="用户信息"
            onClick={this.viewUserMessage}
          >
            用户信息
              </span>
        </Menu.Item>
        <Menu.Item>
          <Link to="/order/work-list">工单管理</Link>
        </Menu.Item>
        {/*<Menu.Divider />*/}
        <Menu.Item>
          <a href="/user/user-detailed/change-password">修改密码</a>
        </Menu.Item>
        <Menu.Item>
          {/* <Link to="/user/login">退出登录</Link>    */}
          <a onClick={this.logout}>退出登录</a>
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        {/* <Link to="/product/detail" className={styles['header-font']}>产品</Link> */}
        {this.state.productList.length > 0 ? (
          <Dropdown
            overlay={productMenu}
            onVisibleChange={this.handleProductVisibleChange}
            visible={this.state.productMenuVisible}
          >
            <span className={`${styles.link} ant-dropdown-link`}>
              产品 <Icon type="down" />
            </span>
          </Dropdown>
        ) : (
            <span className={`${styles.link} ant-dropdown-link`}>
              产品
          </span>
          )}
        <Link to="/console" className={styles['header-font']}>
          控制台
        </Link>{' '}
        <div className={styles.right}>
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <i className={`icon iconfont ${styles.icon}`}>&#xe671;</i>
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
        </div>
        <UserCentre
          defaultdatas={this.state.userData}
          visible={this.state.userInforVisible}
          onCancel={this.userInforCancel}
          onCreate={this.userInforOk}
        />
      </div>
    );
  }
}

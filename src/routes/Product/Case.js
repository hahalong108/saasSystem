import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Badge } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import logo from '../../assets/img/logo.svg';
import styles from './Detail.less';
import '../../common.less';
const SubMenu = Menu.SubMenu;
import jqy from 'jquery';
import UserCentre from '../../components/UserCentre/UserCentre';

class Case extends React.PureComponent {
  constructor(props) {
    let caseHtml = '';
    if (props.location.search != '') {
      caseHtml = props.location.search.split('=')[1];
    }
    super(props);
    this.state = {
      productMenuVisible: false,
      suportMenuVisible: false,
      userCentreMenuVisible: false,
      caseMenuVisible: false,
      productList: [],
      visible: false,
      casesList: [],
      frameHeight: '500px',
      caseUrl: '/api/saas-file/' + caseHtml,
      userInforVisible: false,
      userData: {},
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });

    this.props.dispatch({
      type: 'product/getAll',
    });

    this.props.dispatch({
      type: 'product/getCase',
    });
    // this.props.dispatch({
    //     type: 'product/getProduct',
    //     payload: {
    //         appId: this.state.appId,
    //     }
    // });
  }
  componentDidMount() {
    let winHeight = jqy(document.body).height();
    let frameHeight = winHeight - 64;
    this.setState({
      frameHeight: frameHeight + 'px',
    });
  }
  setIframeHeight = () => {
    var iframeid = document.getElementById('myCase');
    if (iframeid.contentWindow && iframeid.contentWindow.document.body.offsetHeight) {
      iframeid.style.height = iframeid.contentWindow.document.body.offsetHeight + 'px';
    }
  };

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
    if (next.returnType === 'getCase' && next.resultCode == 1000) {
      this.setState({
        casesList: next.data,
      });
    }
    next.returnType = '';
  }

  handleProductVisibleChange = flag => {
    this.setState({ productMenuVisible: flag });
  };
  handleSuportVisibleChange = flag => {
    this.setState({ suportMenuVisible: flag });
  };
  handleUserCentreVisibleChange = flag => {
    this.setState({ userCentreMenuVisible: flag });
  };
  handleCaseVisibleChange = flag => {
    this.setState({ caseMenuVisible: flag });
  };
  // getCaseHtml = (path) => {
  //     this.setState({
  //         caseUrl: "/api/saas-file" + path,
  //     })
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
    const { productList, casesList } = this.state;
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
    const suportMenu = (
      <Menu>
        <Menu.Item key="1">
          <a href="/publish/manage-document" target="_blank">
            帮助文档
          </a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="/order/work-list" target="_blank">
            工单服务
          </a>
        </Menu.Item>
      </Menu>
    );
    const userCentreMenu = (
      <Menu>
        <Menu.Item key="1">{this.props.currentUser.name}</Menu.Item>
        {this.props.currentUser.notifyCount > 0 ? (
          <Menu.Item key="2">
            <Badge count={this.props.currentUser.notifyCount}>
              <a href="/manage/manage-message?result=1" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                未读消息
              </a>
            </Badge>
          </Menu.Item>
        ) : null}
        <Menu.Item key="3">
          {/* <a href="/manage/manage-user">用户管理</a> */}
          <span
            title="用户信息"
            onClick={this.viewUserMessage}
          >
            用户信息
              </span>
        </Menu.Item>
        <Menu.Item key="4">
          <a href="/order/work-list">工单管理</a>
        </Menu.Item>
        <Menu.Item key="5">
          <a href="/user/user-detailed/change-password">修改密码</a>
        </Menu.Item>
        <Menu.Item key="6">
          <a onClick={this.logout}>退出登录</a>
        </Menu.Item>
      </Menu>
    );

    const caseMenu = (
      <Menu style={{ width: 120, overflow: 'hidden' }} mode="vertical">
        {casesList.map((item, index) => {
          return (
            <SubMenu key={item.appId} title={<span>{item.appName}</span>}>
              {item.appCase.map((subItem, index) => {
                // return <Menu.Item key={subItem.caseName.toString()}><a onClick={() => this.getCaseHtml(subItem.path)}>{subItem.caseName}</a></Menu.Item>
                return (
                  <Menu.Item key={subItem.caseName.toString()}>
                    <a href={`/product/case?caseHtml=${subItem.path}`}>{subItem.caseName}</a>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    );

    return (
      <div className={styles.container} id="container">
        <div className={styles.banner} style={{ height: '64px' }}>
          <div className={styles.header}>
            <div className={styles.left}>
              <img src={logo} width="66" height="34" alt="LOGO" />
              <a href="/product/index">望海SAAS应用平台</a>
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
              <Dropdown
                overlay={suportMenu}
                onVisibleChange={this.handleSuportVisibleChange}
                visible={this.state.suportMenuVisible}
              >
                <span className={`${styles.link} ant-dropdown-link`}>
                  支持与服务 <Icon type="down" />
                </span>
              </Dropdown>
              {this.state.casesList.length > 0 ? (
                <Dropdown
                  overlay={caseMenu}
                  onVisibleChange={this.handleCaseVisibleChange}
                  visible={this.state.caseMenuVisible}
                >
                  <span className={`${styles.link} ant-dropdown-link`}>
                    案例 <Icon type="down" />
                  </span>
                </Dropdown>
              ) : (
                  <span className={`${styles.link} ant-dropdown-link`}>
                    案例
                    </span>
                )}
            </div>
            <div className={styles.right}>
              <Link to="/console" className={styles.link}>
                控制台
              </Link>
              {this.props.currentUser.name != undefined ? (
                <Dropdown
                  overlay={userCentreMenu}
                  onVisibleChange={this.handleUserCentreVisibleChange}
                  visible={this.state.userCentreMenuVisible}
                >
                  <span className={`${styles.link} ant-dropdown-link`}>
                    <i className="iconfont icon-yonghu" />
                  </span>
                </Dropdown>
              ) : (
                  <a className={`${styles.link} ant-dropdown-link`} href="/user/login">
                    <i className="iconfont icon-yonghu" />
                  </a>
                )}
            </div>
          </div>
        </div>
        <div className={styles.iframeBox}>
          <iframe
            id="myCase"
            src={this.state.caseUrl}
            frameBorder="0"
            width="100%"
            height="100%"
            scrolling="no"
            style={{ minHeight: `${this.state.frameHeight}` }}
            onLoad={this.setIframeHeight}
          />
        </div>
        <div className={styles.footerBox} id="footerBox">
          <div className={styles.footer_div}>
            <div className={styles.div_box}>
              <b>咨询热线</b>
              <p>咨询热线 010-888888</p>
              <div>
                <p>版权所有：北京东软望海科技有限公司 京ICP备13014106号-16</p>
                <p>北京东软望海科技有限公司版权所有©-2018</p>
              </div>
            </div>
            <div className={styles.div_box}>
              <b>支持与服务</b>
              <p>&nbsp;</p>
            </div>
            <div className={styles.div_box}>
              <b>账户管理</b>
              <p>&nbsp;</p>
            </div>
            <div className={styles.div_box}>
              <b>快速入口</b>
              <p>&nbsp;</p>
            </div>
            <div className={styles.div_box}>
              <b>资源和社区</b>
              <p>&nbsp;</p>
            </div>
          </div>
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

export default connect(({ login, user, product, manage }) => ({
  login,
  product,
  manage,
  currentUser: user.currentUser,
}))(Case);

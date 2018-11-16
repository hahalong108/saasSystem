import { Form, Menu, Dropdown, Icon, Badge } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import DocumentTitle from 'react-document-title';
import logo from '../../assets/img/logo.svg';
import styles from './Index.less';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import React, { Component } from 'react';
import '../../common.less';
import UserCentre from '../../components/UserCentre/UserCentre';
const SubMenu = Menu.SubMenu;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productMenuVisible: false,
      suportMenuVisible: false,
      userCentreMenuVisible: false,
      caseMenuVisible: false,
      productList: [],
      casesList: [],
      urlHref: '',
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

    const location = window.location;
    if (location.href.indexOf('?') != -1) {
      const urlArr = location.href.split('?');
      const token = urlArr[1].split('=');
      localStorage.setItem('token', token[1]);
      this.props.dispatch({
        //请求权限渲染控制台菜单
        type: 'login/menuTree',
      });
    }
  }
  componentDidMount() {
    const swiper1 = new Swiper('#swiper1', {
      autoplay: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      loop: true,
    });
    const swiper2 = new Swiper('#swiper2', {
      slidesPerView: 4,
      spaceBetween: 15,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.product;
    const currentSpace = nextProps.login;
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
    if (currentSpace.resultCode === 1000 && currentSpace.returnType == 'loginstate') {
      //登录通过
      this.props.dispatch({
        //请求权限渲染控制台菜单
        type: 'login/menuTree',
      });
    }
    if (currentSpace.resultCode === 1000 && currentSpace.returnType == 'getmenuTree') {
      //请求成功后页面跳转
      currentSpace.returnType = '';
      localStorage.setItem('menuData', JSON.stringify(currentSpace.menuTreeData));
      this.props.dispatch({
        type: 'login/authorityTags',
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
          // return <Menu.Item key={product.appId}><a onClick={() => this.getProduct(product.appId)}>{product.appName}</a></Menu.Item>
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
                    <a href={`/product/case?caseHtml=${subItem.path}`} target="_blank">
                      {subItem.caseName}
                    </a>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    );
    return (
      <DocumentTitle title="望海SAAS应用平台">
        <div className={styles.container}>
          <div className={styles.banner}>
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
            <div className="swiper-container" id="swiper1" style={{ height: '640px' }}>
              <div className="swiper-wrapper" style={{ height: '640px' }}>
                <div
                  className={`${styles.banner1} swiper-slide`}
                  style={{ height: '640px', marginTop: 0, border: 'none' }}
                >
                  <div className={styles.words}>
                    <p>
                      <span>安全、稳定</span>
                      <span>的云计算产品</span>
                    </p>
                    <p>计算、存储、网络、安全、大数据，助您飞跃发展</p>
                  </div>
                  <img
                    src={require('../../assets/img/banner.png')}
                    width="867"
                    height="auto"
                    alt=""
                  />
                </div>
                <div
                  className={`${styles.banner2} swiper-slide`}
                  style={{ height: '640px', marginTop: 0, border: 'none' }}
                >
                  <div className={styles.words}>
                    <p>
                      <span>安全、稳定</span>
                      <span>的云计算产品</span>
                    </p>
                    <p>计算、存储、网络、安全、大数据，助您飞跃发展</p>
                  </div>
                  <img
                    src={require('../../assets/img/banner2.png')}
                    width="894"
                    height="auto"
                    alt=""
                  />
                </div>
              </div>
              <div className="swiper-pagination banner-pagination" />
            </div>
            <div className={styles.footer}>
              <marquee behavior="scroll" direction="left" scrollamount="2">
                <span>公告：服务医疗行业 促进业务再发展 望海SaaS平台 敬请期待</span>
                <span>公告：服务医疗行业 促进业务再发展 望海SaaS平台 敬请期待np</span>
              </marquee>
            </div>
          </div>
          <h2>安全、稳定的云计算产品</h2>
          <h3>计算、存储、网络、安全、大数据，助您飞跃发展</h3>
          <div className={styles.banner_product}>
            <div
              className="swiper-container"
              id="swiper2"
              style={{ width: '1200px', overflowY: 'hidden' }}
            >
              <div className="swiper-wrapper">
                <div className={`${styles.mask_div} swiper-slide`}>
                  <img
                    src={require('../../assets/img/banner_product1.png')}
                    width="100%"
                    height="auto"
                    alt=""
                  />
                  <div className={styles.mask}>成本降低</div>
                </div>
                <div className={`${styles.mask_div} swiper-slide`}>
                  <img
                    src={require('../../assets/img/banner_product2.png')}
                    width="100%"
                    height="auto"
                    alt=""
                  />
                  <div className={styles.mask}>资源监控</div>
                </div>
                <div className={`${styles.mask_div} swiper-slide`}>
                  <img
                    src={require('../../assets/img/banner_product3.png')}
                    width="100%"
                    height="auto"
                    alt=""
                  />
                  <div className={styles.mask}>安全可靠</div>
                </div>
                <div className={`${styles.mask_div} swiper-slide`}>
                  <img
                    src={require('../../assets/img/banner_product4.png')}
                    width="100%"
                    height="auto"
                    alt=""
                  />
                  <div className={styles.mask}>维护简便</div>
                </div>
                <div className={`${styles.mask_div} swiper-slide`}>
                  <img
                    src={require('../../assets/img/banner_product5.png')}
                    width="100%"
                    height="auto"
                    alt=""
                  />
                  <div className={styles.mask}>高速快捷</div>
                </div>
              </div>
              <div className="swiper-button-prev swiper-button-white" />
              <div className="swiper-button-next swiper-button-white" />
            </div>
          </div>
          <h2>成功案例</h2>
          <h3>实战干货、实战干货、实战干货、实战干货</h3>
          <div className={styles.succes_case}>
            <div className={styles.case_div}>
              <img
                src={require('../../assets/img/success_case1.jpg')}
                width="388"
                height="auto"
                alt=""
              />
              <p>案例：实战案例介绍</p>
            </div>
            <div className={styles.case_div}>
              <img
                src={require('../../assets/img/success_case2.jpg')}
                width="388"
                height="auto"
                alt=""
              />
              <p>案例：实战案例介绍</p>
            </div>
            <div className={styles.case_div}>
              <img
                src={require('../../assets/img/success_case3.jpg')}
                width="388"
                height="auto"
                alt=""
              />
              <p>案例：实战案例介绍</p>
            </div>
          </div>
          <h2>携手共赢，与全球合作伙伴共建云端生态</h2>
          <h3>加入望海云生态合作伙伴计划，开创新业务，获取技术、资源，实现更快速成长</h3>
          <div className={styles.footer}>
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
      </DocumentTitle>
    );
  }
}
export default connect(({ user, product, login, manage }) => ({
  product,
  login,
  manage,
  currentUser: user.currentUser,
}))(Index);

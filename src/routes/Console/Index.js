import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './Index.less';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';
import '../../common.less';
import jqy from 'jquery';
import { Form, Card, Button, Modal, Icon } from 'antd';
import { severityEvent, productState } from '../../common.js';
import jQuery from '../../scroll';
import moment from 'moment';

@connect(({ console, loading,user }) => ({
  console,
  user,
  submitting: loading.effects['console/getWarningEvents'],
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warningEventData: [],
      noticeData: [],
      ProductStateData: [],
      productListData: [],
      documentListData: [],
      productName: '',
      visible: false,
      noticeDetail: '',
      createTime: '',
      productLen: 0,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  componentDidUpdate() {
    var mySwiperBanner = new Swiper('#swiper', {
      slidesPerView: this.state.productLen,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
      // autoplay: true,
      spaceBetween: 15,
    });

    jQuery('#scrollState').myScroll();
  }
  componentDidMount = () => {
    this.getState = setInterval(
      function() {
        this.props.dispatch({
          type: 'console/getProductState',
        });
      }.bind(this),
      60000
    );
  };

  componentWillUnmount() {
    clearInterval(this.getState);
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.console;
    const user = nextProps.user;
    
    if (user.returnType === 'currentUser' && user.currentCount == 1000) {
      user.returnType="";
      this.props.dispatch({
        type: 'console/getWarningEvents',
      });
      this.props.dispatch({
        type: 'console/getNotice',
      });
      this.props.dispatch({
        type: 'console/getProductState',
      });
      this.props.dispatch({
        type: 'console/getProductList',
      });
    }
    if (next.returnType === 'getWarningEvents' && next.resultCode == 1000) {
      this.setState({
        warningEventData: next.resultData,
      });
    }
    if (next.returnType === 'getNotice' && next.resultCode == 1000) {
      this.setState({
        noticeData: next.resultData,
      });
    }
    if (next.returnType === 'getProductState' && next.resultCode == 1000) {
      this.setState({
        ProductStateData: next.resultData,
      });
    }
    if (next.returnType === 'getProductList' && next.resultCode == 1000) {
      if (next.resultData.length > 0) {
        this.setState({
          productListData: next.resultData,
          productName: next.resultData[0].appName,
          productLen: next.resultData.length,
        });
        this.props.dispatch({
          type: 'console/getProductDocument',
          payload: {
            appId: next.resultData[0].appId,
          },
        });
      }
    }
    if (next.returnType === 'getDocumentList' && next.resultCode == 1000) {
      this.setState({
        documentListData: next.resultData,
      });
    }
    if (next.resultCode == 2018) {
      dispatch(routerRedux.push('/user/login'));
    }

    next.returnType = '';
  }

  hoverProduct = (productId, productName) => {
    this.setState({
      productName: productName,
    });
    this.props.dispatch({
      type: 'console/getProductDocument',
      payload: {
        appId: productId,
      },
    });
  };
  viewNotice = (noticeDetail, createTime) => {
    this.setState({
      visible: true,
      noticeDetail: noticeDetail,
      createTime: createTime,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const {
      warningEventData,
      productListData,
      documentListData,
      ProductStateData,
      noticeData,
    } = this.state;
    const eventNum = warningEventData.length;
    const eventPercent = 100 / eventNum;
    const colors = ['#498bfc', '#83cc2b', '#fcae14', '#f54e91'];

    let warningEventList = [];
    if (warningEventData.length == 0) {
      warningEventList.push(
        <div style={{ lineHeight: '170px', textAlign: 'center' }}>暂无数据</div>
      );
    } else {
      warningEventList = warningEventData.map((warningEvent, index) => (
        <div
          className={styles.eventBox}
          key={warningEvent.severity}
          style={{ width: `${eventPercent}%` }}
        >
          <div className={styles.eventBoxPosition}>
            <div
              className={styles.eventBoxUp}
              style={{ borderColor: `${colors[index]}`, color: `${colors[index]}` }}
            >
              {warningEvent.noticeCount}
            </div>
          </div>
          <div className={styles.eventBoxDown}>{severityEvent[warningEvent.severity]}</div>
        </div>
      ));
    }

    let productList = [];
    if (productListData.length == 0) {
      jqy('#hideDiv')
        .show()
        .siblings('#swiper')
        .hide();
    } else {
      jqy('#swiper')
        .show()
        .siblings('#hideDiv')
        .hide();
      productList = productListData.map((item, index) => {
        // item.detailPageFile && item.detailPageFile.path && item.logoFile && item.logoFile.path
        if (!!item.logoFile && !!item.logoFile.path) {
          return (
            <div
              className={`swiper-slide`}
              key={item.appId}
              id={item.appId}
              onMouseEnter={() => {
                this.hoverProduct(item.appId, item.appName);
              }}
            >
              <a href={`/product/detail?appId=${item.appId}`} target="_blank">
                <img
                  className={styles.productPic}
                  src={`/api/saas-file/${item.logoFile.path}`}
                  alt={item.appName}
                />
              </a>
              <div className={styles.productName}>{item.appName}</div>
            </div>
          );
        }
      });
    }

    let documentList = [];
    if (documentListData.length == 0) {
      jqy('#noDocument')
        .show()
        .siblings('#haveDocument')
        .hide();
    } else {
      jqy('#haveDocument')
        .show()
        .siblings('#noDocument')
        .hide();
      documentList = documentListData.map((item, index) => {
        if (index < 4) {
          return (
            <div className={styles.ducumentItemBox} key={item.documentId}>
              <p className={styles.ducumentItem}>
                <b>文档名称：</b>
              </p>
              <p className={styles.ducumentItem}>
                <Icon type="arrow-down" />
                <a
                  href={`/api/saas-file/${item.documentPath}`}
                  target="_blank"
                  className={styles.documentLink}
                  title={`点击下载${item.documentName}`}
                >
                  {item.documentName}
                </a>
              </p>
              <p className={styles.ducumentItem}>
                <b>文档类型：</b>
              </p>
              <p className={styles.ducumentItem}>{item.documentTypeName}</p>
              <p className={styles.ducumentItem}>
                <b>版本号：</b>
              </p>
              <p className={styles.ducumentItem}>{item.versionName}</p>
            </div>
          );
        }
      });
    }

    let stateList = [];
    if (ProductStateData.length == 0) {
      stateList.push(<li style={{ margin: '30px auto', textAlign: 'center' }}>暂无数据</li>);
    } else {
      stateList = ProductStateData.map((item, index) => {
        if (item.productState == '1') {
          return (
            <li key={item.productName.toString()}>
              <div className={styles.prodName}>
                <a
                  href={`//${item.productName}?token=${item.token}`}
                  target="_blank"
                  title={item.productName}
                >
                  {index + 1}.{item.productName}
                </a>
              </div>
              <div className={styles.prodState}>
                <span className={styles.renew} />
                {productState[item.productState]}
              </div>
            </li>
          );
        } else if (item.productState == '0') {
          return (
            <li key={item.productName.toString()}>
              <div className={styles.prodName}>
                <a
                  href={'//' + `${item.productName}?token=${item.token}`}
                  target="_blank"
                  title={item.productName}
                >
                  {index + 1}.{item.productName}
                </a>
              </div>
              <div className={styles.prodState}>
                <span className={styles.normal} />
                {productState[item.productState]}
              </div>
            </li>
          );
        }
      });
    }

    let noticeList = [];
    if (noticeData.length == 0) {
      noticeList.push(<li style={{ margin: '30px auto', textAlign: 'center' }}>暂无数据</li>);
    } else {
      noticeList = noticeData.map((item, i) => {
        if (i < 5) {
          return (
            <li key={item.annId}>
              <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
              <span>
                <a
                  href="#"
                  onClick={() => {
                    this.viewNotice(item.message, item.createTime);
                  }}
                  title={item.message}
                >
                  {item.message}
                </a>
              </span>
            </li>
          );
        }
      });
    }

    return (
      <div className={styles.containerBox}>
        <div className={styles.container}>
          <div className={styles.containerMain}>
            <Card title="预警事件">
              <div className={styles.eventWrapBox}>{warningEventList}</div>
            </Card>
            <Card
              title="所有产品列表"
              className={styles.marginTop}
              extra={
                <a href="/publish/manage-product" className={styles.getMore}>
                  详情
                </a>
              }
            >
              <div className="swiper-container" id="swiper">
                <div className="swiper-wrapper">{productList}</div>
                <div className="swiper-button-prev swiper-button-white" />
                <div className="swiper-button-next swiper-button-white" />
              </div>
              <div className="swiper-container" id="hideDiv">
                暂无数据
              </div>
            </Card>
            <Card
              title={`${this.state.productName}使用文档`}
              className={styles.marginTop}
              style={{ marginBottom: 24 }}
              extra={
                <a href="/publish/manage-document" className={styles.getMore}>
                  更多
                </a>
              }
            >
              <div className={styles.documentBox} id="haveDocument">
                {documentList}
              </div>
              <div
                className={styles.documentBox}
                id="noDocument"
                style={{ textAlign: 'center', lineHeight: '240px' }}
              >
                暂无数据
              </div>
            </Card>
          </div>
          <div className={styles.containerRight}>
            <Card title="公告">
              <ul className={styles.rankingList}>
                {/* {this.state.noticeData.map((item, i) => {
                                    if (i < 5) {
                                        return (
                                            <li key={item.annId}>
                                                <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                                                <span><a href="#" onClick={() => { this.viewNotice(item.message, item.createTime) }} title={item.message}>{item.message}</a></span>
                                            </li>)
                                    }
                                }
                                )} */}
                {noticeList}
              </ul>
            </Card>
            <Modal
              title="公告详情"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={
                <Button onClick={this.handleCancel} type="primary">
                  确定
                </Button>
              }
            >
              <p className={styles.timePosition}>
                {moment(this.state.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </p>
              <div className={styles.noticeBox}>{this.state.noticeDetail}</div>
            </Modal>
            <Card title="产品运行状态" className={styles.marginTop}>
              <div className={styles.stateBox} id="scrollState">
                <ul className={styles.textList}>{stateList}</ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

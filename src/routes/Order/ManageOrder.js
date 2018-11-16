import React, { Component } from 'react';
import {
  Tabs,
  Form,
  Icon,
  Modal,
  Radio,
  Divider,
  Pagination,
  Input,
  message,
  Button,
  Row,
  Col,
  Table,
  Select,
} from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import TitleItem from '../../components/common/TitleItem.js';
import { OrderBuy } from '../../components/Order/OrderBuy';
import { PayResult } from '../../components/Order/PayResult';
import moment from 'moment';
import styles from './Order.less';
import '../../common.less';
import { pageSize, manageOrderStatus } from '../../common';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/initPage'],
}))
@Form.create()
export default class ManageOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,
      data: [],

      visible: false,
      payResultVisible: false,
      buyData: {},
      buyRecord: [],
      buyDataJson: '',
    };
  }

  componentWillMount() {
    this.getPage();
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const next = nextProps.order;
    if (next.returnType === 'getInitPage' && next.resultCode === 1000) {
      next.resultCode = 0;

      this.setState({
        data: next.data,
        current: next.page.curpage,
        total: next.page.totalRecs,
        pageSize: next.page.size,
        allPage: next.page.pageCounts,
      });
    }
    if (next.returnType === 'initData' && next.resultCode === 1000) {
      next.resultCode = 0;
      message.success('初始化成功，开通中...');
      this.getPage();
    }
    if (next.returnType === 'selectOrder' && next.resultCode === 1000) {
      // next.resultCode = 0;
      this.setState({
        buyData: next.data,
        buyDataJson: next.data.customizedJson,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const myPro = new Promise((resolve, reject) => {
        this.setState({
          appName: values.appName,
        });
        resolve();
      });
      myPro.then(() => {
        this.getPage();
      });
    });
  };
  initData = e => {
    this.props.dispatch({
      type: 'order/initData',
      payload: {
        orderId: e.orderId,
        orderDetId: e.orderDetId,
      },
    });
  };

  pageChange = e => {
    let val = e;
    const myPro = new Promise((resolve, reject) => {
      this.setState({
        pageSize: val,
      });
      resolve();
    });
    myPro.then(() => {
      this.getPage();
    });
  };

  getPage = curpage => {
    const { appName, pageSize, current } = this.state;
    this.props.dispatch({
      type: 'order/initPage',
      payload: {
        searchParams: {
          appName: !!appName ? appName : '',
        },
        page: {
          size: pageSize,
          curpage: !!curpage ? curpage : current,
        },
      },
    });
  };

  changePage = (page, pageSize) => {
    const myPro1 = new Promise((resolve, reject) => {
      this.setState({
        current: page,
      });
      resolve();
    });
    myPro1.then(() => {
      this.getPage();
    });
  };

  showModal = buyRecord => {
    this.setState({
      visible: true,
      buyRecord: buyRecord,
    });
    this.props.dispatch({
      type: 'order/selectOrder',
      payload: {
        orderId: buyRecord[0].orderId,
        orderDetId: buyRecord[0].orderDetId,
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      buyData: '',
      buyDataJson: '',
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  payResultShow = () => {
    this.setState({
      payResultVisible: true,
    });
  };

  payResultOk = () => {
    this.setState({
      payResultVisible: false,
    });
    this.getPage(1);
  };
  payResultCancel = () => {
    this.setState({
      payResultVisible: false,
    });
  };
  payResultFooterCancel = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/income-expenses',
      })
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    // 标记tag   图标icon
    const columns = [
      {
        title: '编号',
        dataIndex: 'rowId',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        key: 'appName',
      },
      {
        title: '访问域名',
        dataIndex: 'vhDomainName',
        key: 'vhDomainName',
      },
      {
        title: '购买时长',
        dataIndex: 'buyYears',
        key: 'buyYears',
      },
      {
        title: '结束时间',
        dataIndex: 'expireTime',
        key: 'expireTime',
        align: 'center',
        render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '客户端ID',
        dataIndex: 'clientId',
        key: 'clientId',
      },
      {
        title: '客户端密钥',
        dataIndex: 'clientSecret',
        key: 'clientSecret',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => <span>{manageOrderStatus[text]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        align: 'center',
        render: (text, record, index) => (
          <span>
            {/*<InitCollection initRecord={record} />*/}
            <Button
              onClick={this.initData.bind(this, record)}
              size="small"
              disabled={record.state == 2 ? false : true}
            >
              初始化
            </Button>
            {/*<OrderBuy buyRecord={[record,"续费"]} />*/}
            {record.state === 1 && (
              <Button
                className={styles.buy_btn}
                size="small"
                type="primary"
                style={{ marginLeft: '10px' }}
                onClick={this.showModal.bind(this, [record, '未支付'])}
              >
                支付
              </Button>
            )}
            {record.state !== 1 && (
              <Button
                className={styles.buy_btn}
                size="small"
                type="primary"
                disabled={record.state === 5 ? false : record.state === 6 ? false : true}
                style={{ marginLeft: '10px' }}
                onClick={this.showModal.bind(this, [record, '续费'])}
              >
                续费
              </Button>
            )}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="应用名称"
                  style={{ width: 300, float: 'left' }}
                >
                  {getFieldDecorator('appName', {})(
                    <Input placeholder="应用名称" className={styles.antInputText} />
                  )}
                </FormItem>
                <FormItem style={{ float: 'right' }}>
                  <Button
                    icon="search"
                    className={styles.btn}
                    htmlType="submit"
                    onClick={this.handleSubmit}
                  >
                    查询
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="订单管理" />
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              bordered
              rowKey={record => record.orderDetId}
              loading={this.props.submitting}
            />
            <div className={styles.pageDiv}>
              <span className={styles.pageStyle}>
                <Select
                  onChange={this.pageChange}
                  style={{ width: '95px', margin: '0 5px' }}
                  defaultValue={`${this.state.pageSize}行/页`}
                  className={styles.selectOption}
                >
                  <option value="5">5行/页</option>
                  <option value="10">10行/页</option>
                  <option value="15">15行/页</option>
                  <option value="20">20行/页</option>
                  <option value="30">30行/页</option>
                  <option value="40">40行/页</option>
                  <option value="50">50行/页</option>
                  <option value="100">100行/页</option>
                </Select>
              </span>
              <Pagination
                showQuickJumper
                pageSize={Number(this.state.pageSize)}
                onChange={this.changePage}
                current={this.state.current}
                total={this.state.total}
              />
              <span className={styles.pageStyle}>
                共{this.state.total}条记录 第{this.state.current}/{this.state.allPage}页{' '}
              </span>
            </div>
          </Form>
          <OrderBuy
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            buyData={this.state.buyData}
            buyDataJson={this.state.buyDataJson}
            buyRecord={this.state.buyRecord}
            orderId={this.state.buyRecord.orderId}
            orderDetId={this.state.buyRecord.orderDetId}
            title="订单支付"
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            payResultVisible={this.payResultShow}
            getPage={this.getPage}
          />
          <PayResult
            visible={this.state.payResultVisible}
            payResultCancel={this.payResultCancel}
            payResultOk={this.payResultOk}
            payResultFooterCancel={this.payResultFooterCancel}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

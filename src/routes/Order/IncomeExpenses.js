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
import { pageSize, payType, payState, payTypeReverse } from '../../common';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/incomeExpenses'],
}))
@Form.create()
export default class IncomeExpenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      payType: '',
      state: [],
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
    if (next.returnType === 'incomeExpenses' && next.resultCode === 1000) {
      next.returnType = '';
      this.setState({
        data: next.data,
        current: next.page.curpage,
        total: next.page.totalRecs,
        pageSize: next.page.size,
        allPage: next.page.pageCounts,
      });
    }

    if (next.returnType === 'selectOrder' && next.resultCode === 1000) {
      next.returnType = '';
      this.setState({
        buyData: next.data,
        buyDataJson: next.data.customizedJson,
      });
    }
    if (next.returnType === 'incomeExpensesCheck' && next.resultCode === 1000) {
      next.returnType = '';
      message.success(next.desc);
    }
    if (next.returnType === 'incomeExpensesCheck' && next.resultCode !== 1000) {
      next.returnType = '';
      message.error(next.desc);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const myPro = new Promise((resolve, reject) => {
        this.setState({
          appName: values.appName,
          payType: values.payType,
          state: values.state,
        });
        resolve();
      });
      myPro.then(() => {
        this.getPage();
      });
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
    const { appName, payType, pageSize, state, current } = this.state;
    this.props.dispatch({
      type: 'order/incomeExpenses',
      payload: {
        searchParams: {
          appName: !!appName ? appName : '',
          payType: !!payType ? payType : '',
          state: !!state ? state : [],
        },
        page: {
          size: pageSize,
          curpage: !!curpage ? curpage : current,
        },
      },
    });
  };

  changePage = (page, pageSize) => {
    // console.log(page, pageSize);
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
    this.setState({ visible: false });
    this.setState({
      buyData: '',
      buyDataJson: '',
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  check = e => {
    this.props.dispatch({
      type: 'order/incomeExpensesCheck',
      payload: {
        paymentId: e[0],
        payType: e[1],
      },
    });
  };
  payResultShow = () => {
    this.setState({
      payResultVisible: true,
    });
  };
  payResultOk = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '/order/manage-order',
      })
    );
  };
  payResultCancel = () => {
    this.setState({
      payResultVisible: false,
    });
  };
  payResultFooterCancel = () => {
    this.setState({
      payResultVisible: false,
    });
    this.getPage(1);
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
        align: 'center',
      },
      {
        title: '交易类型',
        dataIndex: 'payType',
        key: 'payType',
        align: 'center',
        render: (text, record) => <span>{payType[text]}</span>,
      },
      {
        title: '交易金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        align: 'center',
      },
      {
        title: '交易时间',
        dataIndex: 'payTime',
        key: 'payTime',
        align: 'center',
        render: text => <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '交易状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (text, record) => <span>{payState[text]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        align: 'center',
        render: (text, record) => (
          <span>
            {/*<InitCollection initRecord={record} />*/}
            <Button
              size="small"
              disabled={record.payType === 4 ? true : false}
              onClick={this.check.bind(this, [record.paymentId, record.payType])}
            >
              核查
            </Button>
            <Button
              className={styles.buy_btn}
              size="small"
              type="primary"
              disabled={record.state === 1 ? false : true}
              style={{ marginLeft: '10px' }}
              onClick={this.showModal.bind(this, [record, '支付'])}
            >
              支付
            </Button>
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
                <FormItem
                  {...formItemLayout}
                  label="交易类型"
                  style={{ width: 300, float: 'left' }}
                >
                  {getFieldDecorator('payType', {})(
                    <Select>
                      <option value={1}>支付宝</option>
                      <option value={2}>银联</option>
                      {/*<option value={3}>微信</option>*/}
                      <option value={4}>线下合同</option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="交易状态"
                  style={{ width: 300, float: 'left' }}
                >
                  {getFieldDecorator('state', {})(
                    <Select
                      mode="multiple"
                      placeholder="状态"
                      style={{ width: '100%', textAlign: 'left' }}
                      // onChange={handleChange}
                    >
                      <option value={1}>未支付</option>
                      <option value={2}>支付失败</option>
                      <option value={3}>支付成功</option>
                      <option value={4}>支付完成</option>
                      <option value={5}>交易关闭</option>
                    </Select>
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
                  <TitleItem title="收支管理" />
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

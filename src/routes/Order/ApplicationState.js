import React, { Component } from 'react';
import { Tabs, Form, Pagination, Input, Button, Row, Col, Table, Select } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import TitleItem from '../../components/common/TitleItem.js';
import styles from './Order.less';
import '../../common.less';
import { pageSize, productState } from '../../common';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/applicationState'],
}))
@Form.create()
export default class ApplicationState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,
      data: [],
      protocol: '',
    };
  }

  componentWillMount() {
    this.getPage();
    const protocol = window.location.protocol;
    this.setState({
      protocol: protocol,
    });
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.order;
    if (next.returnType === 'applicationState' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        data: next.data,
        current: next.page.curpage,
        total: next.page.totalRecs,
        pageSize: next.page.size,
        allPage: next.page.pageCounts,
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
      type: 'order/applicationState',
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
        title: '服务状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (text, record) => <span>{productState[text]}</span>,
      },
      {
        title: '访问用户数',
        dataIndex: 'userCount',
        key: 'userCount',
        align: 'center',
      },
      {
        title: '产品地址',
        dataIndex: 'softwareName',
        key: 'softwareName',
        render: (text, record) => (
          <span>
            <a href={`${this.state.protocol}//${text}?token=${record.token}`} target="_blank">
              {text}
            </a>
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
                  <TitleItem title="应用状态管理" />
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              bordered
              rowKey="uid"
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
        </div>
      </PageHeaderLayout>
    );
  }
}

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
import moment from 'moment';
import '../../common.less';
import styles from './Publish.less';
import { pageSize, sourceState } from '../../common';
import { DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SourceStateModal from '../../components/Publish/SourceStateModal';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/initResource'],
}))
@Form.create()
export default class ManageResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,
      beginTime: '',
      endTime: '',
      serverTag: '',
      data: [],
      stateData: {},
      stateTitle:'',
      visible: false,
    };
  }

  componentWillMount() {
    this.getPage();
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'initResource' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        data: next.data,
        current: next.page.curpage,
        total: next.page.totalRecs,
        pageSize: next.page.size,
        allPage: next.page.pageCounts,
      });
    }
    if (next.returnType === 'deployResource' && next.resultCode === 1000) {
      next.returnType = '';
      this.setState({
        visible: true,
        stateData: next.data,
      });
    }
    if (next.returnType === 'deployResource' && next.resultCode !== 1000) {
      next.returnType = '';
      message.error(next.desc)
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const myPro = new Promise((resolve, reject) => {
        this.setState({
          appName: values.appName,
          serverTag: values.serverTag,
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
      type: 'publish/initData',
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

  getPage = () => {
    const { appName, beginTime, endTime, serverTag, pageSize, current } = this.state;
    this.props.dispatch({
      type: 'publish/initResource',
      payload: {
        searchParams: {
          appName: !!appName ? appName : '',
          serverTag: !!serverTag ? serverTag : '',
          beginTime: !!beginTime ? beginTime : '',
          endTime: !!endTime ? endTime : '',
        },
        page: {
          size: pageSize,
          curpage: current,
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
  searchTime = (date, dateString) => {
    this.setState({
      beginTime: dateString[0],
      endTime: dateString[1],
    });
  };
  stateModle = record => {
    this.props.dispatch({
      type:'publish/deployResource',
      payload:{
        serverId:record.serverId,
      }
    })
    this.setState({
      stateTitle:record.appName,
    })
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  test = (state,e) => {
    if(state !== 5){
      e.preventDefault();
      e.stopPropagation();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
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
        title: '集群标识',
        dataIndex: 'serverTag',
        key: 'serverTag',
        width: '200px',
        align: 'center',
      },
      {
        title: '剩余数量',
        dataIndex: 'limitTotal',
        key: 'limitTotal',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        render: (text, record) => (
          <span>
            {text === 3 || text === 4 || text === 5 ? (
              <a href="javascript:void(0);" onClick={this.stateModle.bind(this, record)}>
                {sourceState[text]}
              </a>
            ) : (
              sourceState[text]
            )}
          </span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: text => <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        width: '200px',
        align: 'center',
        render: (text, record) => (
          <span>
            <Link
              to={record.state === 5 ?{
                pathname: '/publish/details/resource-details',
                state: { serverId: record.serverId },
              }: '#'}
              onClick={this.test.bind(this,record.state)}
              className={styles.linkStyle}
            >
              <Button type="primary" size="small" disabled={record.state === 5 ? false : true}>
                详情
              </Button>
            </Link>
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
                  {getFieldDecorator('appName')(
                    <Input placeholder="请输入应用名称" className={styles.antInputText} />
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="集群标识"
                  style={{ width: 300, float: 'left' }}
                >
                  {getFieldDecorator('serverTag')(
                    <Input placeholder="请输入集群标识" className={styles.antInputText} />
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="创建时间" style={{ width: 300, float: 'left' }}>
                  {getFieldDecorator('searchTime')(<RangePicker onChange={this.searchTime} />)}
                </FormItem>
              </Col>
              <Col>
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
                  <TitleItem title="资源管理" />
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.data}
              bordered
              rowKey={record => record.serverId}
              pagination={false}
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
          <SourceStateModal
            visible={this.state.visible}
            title={this.state.stateTitle}
            stateData={this.state.stateData}
            onCancel={this.handleCancel}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

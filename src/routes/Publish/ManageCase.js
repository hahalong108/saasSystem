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
  DatePicker,
  Popconfirm,
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
import styles from './Publish.less';
import moment from 'moment';
import '../../common.less';
import { pageSize, getTags } from '../../common';
import CreateCase from '../../components/Publish/CreateCase';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/casePage'],
}))
@Form.create()
export default class ManageCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      caseName: '',
      beginTime: '',
      endTime: '',
      current: 1,
      total: 0,
      pageSize: pageSize,
      allPage: 1,
      data: [],
      visible: false,
      selectedRowKeys: [],
    };
  }

  componentWillMount() {
    this.getPage();
    this.props.dispatch({
      type: 'publish/applicationlist',
    });
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'casePage' && next.resultCode === 1000) {
      next.returnType = '';
      this.setState({
        data: next.data,
        current: next.page.curpage,
        total: next.page.totalRecs,
        pageSize: next.page.size,
        allPage: next.page.pageCounts,
      });
    }
    if (next.returnType === 'createCase' && next.resultCode === 1000) {
      this.setState({
        visible: false,
      });
      message.success('新建成功！');
      this.getPage(1);
    }
    if (next.returnType === 'createCase' && next.resultCode !== 1000) {
      next.returnType = '';
      message.error(next.desc);
    }
    if (next.returnType === 'deleteCase' && next.resultCode === 1000) {
      next.returnType = '';
      message.success('删除成功！');
      this.getPage(1);
    }
    if (next.returnType === 'deleteCase' && next.resultCode !== 1000) {
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
          caseName: values.caseName,
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
    const { appName, caseName, beginTime, endTime, pageSize, current } = this.state;
    this.props.dispatch({
      type: 'publish/casePage',
      payload: {
        searchParams: {
          appName: !!appName ? appName : '',
          caseName: !!caseName ? caseName : '',
          beginTime: !!beginTime ? beginTime : '',
          endTime: !!endTime ? endTime : '',
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
  searchTime = (date, dateString) => {
    this.setState({
      beginTime: dateString[0],
      endTime: dateString[1],
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  deletErr = () => {
    message.error('请选择删除案例！');
  };
  deleteBtn = () => {
    this.props.dispatch({
      type: 'publish/deleteCase',
      payload: this.state.selectedRowKeys,
    });
  };
  handleCreate = val => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        if (!val) {
          message.error('有文件未上传！');
          return;
        }
        values.caseZipFileId = val;
        this.props.dispatch({
          type: 'publish/createCase',
          payload: {
            ...values,
          },
        });
      }
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
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
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      // type:"radio",
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
        title: '案例名称',
        dataIndex: 'caseName',
        key: 'caseName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: text => <span>{text && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
                    <Input placeholder="请输入应用名称" className={styles.antInputText} />
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="案例名称"
                  style={{ width: 300, float: 'left' }}
                >
                  {getFieldDecorator('caseName', {})(
                    <Input placeholder="请输入案例名称" className={styles.antInputText} />
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="创建时间"
                  style={{ width: 300, float: 'left' }}
                >
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
                  <TitleItem title="案例管理" />
                  {getTags().indexOf('case-add') != -1 && (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showModal.bind(this, '新增')}
                    >
                      新增
                    </Button>
                  )}
                  {getTags().indexOf('case-delete') != -1 && (
                    <Popconfirm
                      placement="bottomRight"
                      title="是否确认删除此案例？"
                      onConfirm={
                        this.state.selectedRowKeys.length === 0 ? this.deletErr : this.deleteBtn
                      }
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn}>删除</Button>
                    </Popconfirm>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              loading={this.props.submitting}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.state.data}
              pagination={false}
              bordered
              rowKey={record => record.caseId}
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
          <CreateCase
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

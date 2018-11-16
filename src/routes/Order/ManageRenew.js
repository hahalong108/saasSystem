import React, { Component } from 'react';
import {
  Tabs,
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  Modal,
  Pagination,
  Divider,
  Cascader,
  Popconfirm,
  message,
} from 'antd';
import styles from './Order.less';
import logo from '../../assets/img/logo.svg';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import ManageRenewModal from '../../components/Order/ManageRenewModal.js';
import jqy from 'jquery';
import { pageSize } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/queryApply'],
}))
@Form.create()
export default class ManageRenew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: {},
      editVisible: false,
      appName: '',
      appId: '',
      buyYears: 0,
      queryApplyData: {},
      pageSize: pageSize,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'order/searchApply',
      payload: {
        searchParams: { appName: '' },
        page: {
          size: this.state.pageSize,
          curpage: 1,
        },
      },
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.order;
    console.log(next, '0000000000000000000000000000000000');
    if (next.returnType === 'searchApply' && next.resultCode == 1000) {
      this.setState({
        data: next.resultData,
        page: next.resultPage,
        appName: document.getElementById('appName').value,
      });
    }
    if (next.returnType === 'queryApply' && next.resultCode == 1000) {
      this.setState({
        queryApplyData: next.queryApplyData,
      });
    }
    // if (next.returnType === "createRole" && next.resultCode == 1000) {
    //     message.success('角色添加成功！');
    //     var currentPage = jqy.trim(jqy(".ant-pagination-item-active a").text());
    //     this.props.dispatch({
    //         type: 'manage/searchRole',
    //         payload: {
    //             searchParams: { roleName: this.state.roleNameText },
    //             page: {
    //                 size: pageSize,
    //                 curpage: currentPage,
    //             }
    //         },
    //     });
    // }
    next.returnType = '';
  }
  // 续费 start
  editRoles = (record, index) => {
    this.setState({
      editVisible: true,
      appId: record.appId,
    });
    this.props.dispatch({
      type: 'order/queryApply',
      payload: {
        appId: record.appId,
      },
    });
  };
  editCancel = () => {
    this.setState({ editVisible: false });
    const form = this.editFormRef.props.form;
    form.resetFields();
  };
  editCreate = e => {
    e.preventDefault();
    const form = this.editFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        this.editFormRef.props.dispatch({
          type: 'order/updateApply',
          payload: {
            appId: this.state.appId,
            buyYears: this.state.buyYears,
            // totalPrice: values.totalPrice,
          },
        });
      }
      form.resetFields();
      this.setState({ editVisible: false });
    });
  };
  saveEditFormRef = editFormRef => {
    this.editFormRef = editFormRef;
  };
  // 续费 end

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (!err) {
        this.props.dispatch({
          type: 'order/searchApply',
          payload: {
            searchParams: {
              appName: values.appName,
            },
            page: {
              size: this.state.pageSize,
              curpage: currentPage,
            },
          },
        });
      }
    });
  };
  // onSelectChange = (selectedRowKeys) => {
  //     this.setState({ selectedRowKeys });
  // }

  onChange = page => {
    // const appName = document.getElementById("appName").value;
    this.props.dispatch({
      type: 'order/searchApply',
      payload: {
        searchParams: {
          appName: this.state.appName,
        },
        page: {
          size: this.state.pageSize,
          curpage: page,
        },
      },
    });
  };

  keyOnChange = value => {
    this.setState({
      buyYears: value,
    });
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
    function timestampToTime(timestamp) {
      const date = new Date(timestamp);
      const Y = date.getFullYear() + '-';
      const M =
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      const D = date.getDate() + ' ';
      const h = date.getHours() + ':';
      const m = date.getMinutes() + ':';
      const s = date.getSeconds();
      return Y + M + D + h + m + s;
    }
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
        align: 'center',
      },
      {
        title: '订购日期',
        dataIndex: 'bookTime',
        align: 'center',
        render: (text, record, index) => timestampToTime(text),
      },
      {
        title: '截止日期',
        dataIndex: 'cutOffTime',
        align: 'center',
        render: (text, record, index) => timestampToTime(text),
      },
      {
        title: '操作内容',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <span>
            <a
              href="javascript:;"
              title="续费"
              onClick={() => {
                this.editRoles(record);
              }}
            >
              续费
            </a>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.container}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <Row style={{ width: '100%' }}>
            <Col>
              <FormItem {...formItemLayout} label="应用名称" style={{ width: 300, float: 'left' }}>
                {getFieldDecorator('appName', {
                  initialValue: this.state.appName,
                })(<Input placeholder="应用名称" />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem style={{ float: 'right' }}>
                <Button icon="search" className={styles.btn} htmlType="submit">
                  查询
                </Button>
              </FormItem>
            </Col>
          </Row>
          <Row style={{ width: '100%' }}>
            <Col>
              <FormItem>
                <TitleItem title="续费管理" />
              </FormItem>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={this.state.data}
            bordered
            rowKey={record => record.appId}
            pagination={false}
          />
          <div className={styles.pageBox}>
            <div className={styles.pageWrap}>
              <div className={styles.floatLeft}>单页</div>
              <Select
                onChange={this.pageSizeChange}
                defaultValue={this.state.pageSize}
                className={styles.selectOption}
              >
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="15">15</Option>
                <Option value="20">20</Option>
                <Option value="30">30</Option>
                <Option value="40">40</Option>
                <Option value="50">50</Option>
                <Option value="100">100</Option>
              </Select>
              <div className={styles.floatRight}>行</div>
            </div>
            <Pagination
              total={this.state.page.totalRecs}
              style={{ float: 'right' }}
              showQuickJumper
              showTotal={(total, range) =>
                `共${total}条记录 第${this.state.page.curpage}/${this.state.page.pageCounts}页`
              }
              pageSize={this.state.pageSize}
              current={this.state.page.curpage}
              onChange={this.onChange}
            />
          </div>
        </Form>
        <ManageRenewModal
          wrappedComponentRef={this.saveEditFormRef}
          defaultdatas={this.state.queryApplyData}
          visible={this.state.editVisible}
          onCancel={this.editCancel}
          onCreate={this.editCreate}
          keyOnChange={this.keyOnChange}
        />
      </div>
    );
  }
}

import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  Table,
  Select,
  Pagination,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import classNames from 'classnames';
import styles from './Order.less';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import jqy from 'jquery';
import { pageSize, workListState, workListSubject, getTags } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import { DatePicker } from 'antd';
import QueryWorkList from '../../components/Order/QueryWorkList.js';
import CreateWorkList from '../../components/Order/CreateWorkList.js';
import ReplayMessageList from '../../components/Order/ReplayMessageList.js';
import '../../common.less';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ order, loading, user }) => ({
  order,
  currentUser: user.currentUser,
  submitting: loading.effects['order/workListPage'],
}))
@Form.create()
export default class WorkList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: { key: '' },
      subject: { key: '' },
      listState: { key: '' },
      applicationlistDatas: [],
      beginTime: '',
      endTime: '',
      pageSize: pageSize,
      workListData: [],
      workListPage: {},
      visible: false,
      code: '',
      queryVisible: false,
      workListDetail: {},
      replayMessageVisible: false,
      queryReplayDetail: [],
      workOrderId: '',
      appName: '',

      selectedRowKeys: [],
      loading: false,
      comfirmWorkId: [],
      workState: 3,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'order/getCode',
    });
    this.props.dispatch({
      type: 'order/applicationlist',
    });
    this.props.dispatch({
      type: 'order/workListPage',
      payload: {
        searchParams: {
          // appId: this.state.appId.key,
          appName: this.state.appName,
          subject: this.state.subject.key,
          state: this.state.listState.key,
          beginTime: this.state.beginTime,
          endTime: this.state.endTime,
        },
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
    if (next.returnType === 'applicationlist' && next.resultCode == 1000) {
      this.setState({
        applicationlistDatas: next.resultData,
      });
    }
    if (next.returnType === 'workListPage' && next.resultCode == 1000) {
      this.setState({
        workListData: next.resultData,
        workListPage: next.resultPage,
      });
    }
    if (next.resultCode == 1000 && next.returnType == 'generateCode') {
      this.setState({
        code: next.data,
      });
    }
    if (next.returnType === 'createWorkList' && next.resultCode == 1000) {
      message.success('工单新建成功');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const { appId, subject, beginTime, endTime, listState, appName } = this.state;
      this.props.dispatch({
        type: 'order/workListPage',
        payload: {
          searchParams: {
            // appId: appId.key,
            appName: appName,
            beginTime: beginTime,
            endTime: endTime,
            subject: subject.key,
            state: listState.key,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'comfirmList' && next.resultCode == 1000) {
      message.success('工单确认完成');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const { appId, subject, beginTime, endTime, listState, appName } = this.state;
      this.props.dispatch({
        type: 'order/workListPage',
        payload: {
          searchParams: {
            // appId: appId.key,
            appName: appName,
            beginTime: beginTime,
            endTime: endTime,
            subject: subject.key,
            state: listState.key,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'queryListDetail' && next.resultCode == 1000) {
      this.setState({
        workListDetail: next.resultData,
      });
    }
    if (next.returnType === 'queryReplay' && next.resultCode == 1000) {
      this.setState({
        queryReplayDetail: next.resultData,
      });
    }
    if (next.returnType === 'createReply' && next.resultCode == 1000) {
      next.returnType = '';
      jqy('#lengthControl').text('');

      const messageBoxlen1 = jqy('.messageWrap').length;
      // console.log(messageBoxlen1, "444444444444444444444");

      let createTime = next.resultData;
      const myMessage = jqy('#myMessage').val();
      const messageBox = classNames(styles.messageBox, styles.floatRight, styles.textAlignRight);
      const messageP = classNames(styles.messageP, styles.textAlignRight);
      const messageLabel = classNames(
        styles.messageLabel,
        styles.floatRight,
        styles.textAlignRight,
        styles.paddingLeft
      );
      const messageTextarea = classNames(
        styles.messageTextarea,
        styles.floatRight,
        styles.mineArea,
        styles.textAlignLeft
      );
      const message = classNames(styles.floatRight);

      let appendMessage = "<div class='messageWrap " + messageBox + "'>";
      appendMessage =
        appendMessage +
        "<p class='" +
        messageP +
        "'>" +
        `${moment(createTime).format('YYYY-MM-DD HH:mm:ss')}` +
        '</p>';
      appendMessage = appendMessage + "<div class='" + message + "'>";
      appendMessage =
        appendMessage +
        "<label class='" +
        messageLabel +
        "' title='" +
        `${this.props.currentUser.name}` +
        "'>" +
        `${this.props.currentUser.name}` +
        '</label>';
      appendMessage =
        appendMessage + "<div class='" + messageTextarea + "'>" + myMessage + '</div>';
      appendMessage = appendMessage + '</div>';
      appendMessage = appendMessage + '</div>';

      jqy('#newMessages').append(appendMessage);

      const messageBoxlen2 = jqy('.messageWrap').length;
      // console.log(messageBoxlen2, "9999999999999999999999999");

      if (messageBoxlen2 > messageBoxlen1) {
        // const boxHight1 = jqy('.ant-modal-body .ant-form').height();
        const boxHight = jqy('#messageListBox').height();
        jqy('.ant-modal-body').animate(
          {
            scrollTop: boxHight,
          },
          500
        );
      }

      jqy('#myMessage').val('');
    }

    next.returnType = '';
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          appName: values.appId,
          subject: { key: values.subject.key },
          listState: { key: values.state.key },
          beginTime: !!this.state.beginTimeMoment?this.state.beginTimeMoment:"",
          endTime: !!this.state.endTimeMoment?this.state.endTimeMoment:"",
        });
        this.props.dispatch({
          type: 'order/workListPage',
          payload: {
            searchParams: {
              // appId: values.appId.key,
              appName: values.appId,
              subject: values.subject.key,
              state: values.state.key,
              beginTime: !!this.state.beginTimeMoment?this.state.beginTimeMoment:"",
              endTime: !!this.state.endTimeMoment?this.state.endTimeMoment:"",
            },
            page: {
              size: this.state.pageSize,
              curpage: 1,
            },
          },
        });
      }
    });
  };
  onChange = page => {
    const { appId, subject, beginTime, endTime, listState, appName } = this.state;
    this.props.dispatch({
      type: 'order/workListPage',
      payload: {
        searchParams: {
          // appId: appId.key,
          appName: appName,
          beginTime: beginTime,
          endTime: endTime,
          subject: subject.key,
          state: listState.key,
        },
        page: {
          size: this.state.pageSize,
          curpage: page,
        },
      },
    });
  };
  pageSizeChange = value => {
    this.setState({
      pageSize: value,
    });
    const { appId, subject, beginTime, endTime, listState, appName } = this.state;
    this.props.dispatch({
      type: 'order/workListPage',
      payload: {
        searchParams: {
          // appId: appId.key,
          appName: appName,
          beginTime: beginTime,
          endTime: endTime,
          subject: subject.key,
          state: listState.key,
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };
  handleChangeAppId = value => {
    this.setState({
      appId: value,
    });
  };
  handleChangeSubject = value => {
    // this.setState({
    //   subject: value,
    // });
  };
  handleChangeState = value => {
    // this.setState({
    //   listState: value,
    // });
  };

  searchTime = (date, dateString) => {
    this.setState(() => {
      return { 
        beginTimeMoment: dateString[0],
        endTimeMoment: dateString[1],
      }
    })
  }

  // 新建工单 start
  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    this.setState({ visible: false });
  };
  handleCreate = e => {
    e.preventDefault();
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        function encrypt(word, code) {
          var key = CryptoJS.enc.Utf8.parse(code);
          var srcs = CryptoJS.enc.Utf8.parse(word);
          var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
          return encrypted.toString();
        }
        const codeResult = this.state.code + this.state.code + this.state.code + this.state.code;
        const phoneNumber = encrypt(values.phone, codeResult);

        this.formRef.props.dispatch({
          type: 'order/createWorkList',
          payload: {
            subject: values.subject,
            appId: values.appId,
            message: values.message,
            phone: phoneNumber,
            mail: values.mail,
            // attachmentFileId:"",
            key: codeResult,
          },
        });
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  // 新建工单 end

  // 查看工单详情 start
  queryListDetail = (record, index) => {
    this.setState({
      queryVisible: true,
    });
    this.props.dispatch({
      type: 'order/queryListDetail',
      payload: {
        workId: record.work_id,
      },
    });
  };
  queryCancel = () => {
    this.setState({ queryVisible: false });
  };
  queryCreate = e => {
    this.setState({ queryVisible: false });
  };
  saveQueryFormRef = queryFormRef => {
    this.queryFormRef = queryFormRef;
  };
  // 查看工单详情 end

  // 确认工单 start
  confirmWorklist = () => {
    this.setState({ loading: true });
    const comfirmWorkId = this.state.selectedRowKeys;
    this.props.dispatch({
      type: 'order/comfirmList',
      payload: comfirmWorkId,
    });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
        comfirmWorkId: comfirmWorkId,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  // 确认工单 end

  // 留言 start
  saveMessageFormRef = messageFormRef => {
    this.messageFormRef = messageFormRef;
  };
  leaveMessage = (record, index) => {
    jqy('#newMessages').html('');
    jqy('#myMessage').val('');
    jqy('#lengthControl').text('');

    this.setState({
      replayMessageVisible: true,
      workOrderId: record.work_id,
      workState: record.state,
    });
    this.props.dispatch({
      type: 'order/queryReplayDetail',
      payload: {
        workId: record.work_id,
      },
    });
  };
  replayMessageCancel = () => {
    const form = this.messageFormRef.props.form;
    form.resetFields();
    this.setState({ replayMessageVisible: false });
  };
  replayMessageCreate = e => {
    // e.preventDefault();
    if (this.messageFormRef && !!this.messageFormRef.props) {
      const form = this.messageFormRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        } else {
          if (jqy('#myMessage').val().length > 0 && jqy('#myMessage').val().length <= 200) {
            const myMessage = jqy('#myMessage').val();
            this.messageFormRef.props.dispatch({
              type: 'order/createReply',
              payload: {
                workId: this.state.workOrderId,
                message: myMessage,
              },
            });
          }
        }
        form.resetFields();
      });
    }
  };
  // 留言 end

  handleChangeResult = value => {
    this.setState({
      readStateResult: value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting } = this.props;

    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.state === 0,
        name: `${record.state}`,
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;

    const applicationlist = this.state.applicationlistDatas.map((applicationlistData, index) => (
      <Option value={applicationlistData.appId} key={applicationlistData.appId}>
        {applicationlistData.appName}
      </Option>
    ));
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    const columns = [
      {
        title: '编号',
        dataIndex: 'indexId',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '应用名称',
        dataIndex: 'appName',
        align: 'center',
      },
      {
        title: '问题类型',
        dataIndex: 'subject',
        align: 'center',
        render: (text, record, index) => workListSubject[text],
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text, record, index) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '工单状态',
        dataIndex: 'state',
        align: 'center',
        render: (text, record, index) => workListState[text],
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <div>
            <a
              href="javascript:;"
              title="查看工单详情"
              onClick={() => {
                this.queryListDetail(record);
              }}
            >
              详情
            </a>
            {getTags().indexOf('wOrder-add-reply') != -1 && (
              <span>
                <Divider type="vertical" />
                <a
                  href="javascript:;"
                  title="留言"
                  onClick={() => {
                    this.leaveMessage(record);
                  }}
                >
                  留言
                </a>
              </span>
            )}
          </div>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="应用名称"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('appId', {
                    // initialValue: { key: `${this.state.appId.key}` },
                    initialValue: this.state.appName,
                  })(
                    // <Select placeholder="请选择" style={{ width: '135' }} labelInValue onChange={this.handleChangeAppId}>
                    //     <Option value="">请选择</Option>
                    //     {applicationlist}
                    // </Select>

                    <Input placeholder="应用名称" className={styles.antInputText} />
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="创建时间"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('searchTime')(<RangePicker onChange={this.searchTime} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="问题类型"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('subject', {
                    initialValue: { key: `${this.state.subject.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeSubject}
                    >
                      <Option value="">请选择</Option>
                      <Option value="1">售前</Option>
                      <Option value="2">售后</Option>
                      <Option value="3">保修</Option>
                      <Option value="4">发票</Option>
                      <Option value="5">退款</Option>
                    </Select>
                  )}
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
                <FormItem
                  {...formItemLayout}
                  label="工单状态"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('state', {
                    initialValue: { key: `${this.state.listState.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeState}
                    >
                      <Option value="">请选择</Option>
                      <Option value="0">完成</Option>
                      <Option value="1">未完成</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="工单管理" />
                  {getTags().indexOf('work-order-add') != -1 && (
                    <Button type="primary" className={styles.btn} onClick={this.showModal}>
                      新建工单
                    </Button>
                  )}
                  {getTags().indexOf('work-order-update') != -1 && (
                    <Popconfirm
                      title="是否确认选中工单?"
                      onConfirm={this.confirmWorklist}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button className={styles.btn} disabled={!hasSelected} loading={loading}>
                        工单确认
                      </Button>
                    </Popconfirm>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.workListData}
              bordered
              rowKey={record => record.work_id}
              pagination={false}
              loading={submitting}
              rowSelection={rowSelection}
            />
            <div className={styles.pageBox}>
              <div className={styles.pageWrap}>
                {/* <div className={styles.floatLeft}>单页</div> */}
                <Select
                  onChange={this.pageSizeChange}
                  defaultValue={this.state.pageSize + `行/页`}
                  className={styles.selectOption}
                >
                  <Option value="5">5行/页</Option>
                  <Option value="10">10行/页</Option>
                  <Option value="15">15行/页</Option>
                  <Option value="20">20行/页</Option>
                  <Option value="30">30行/页</Option>
                  <Option value="40">40行/页</Option>
                  <Option value="50">50行/页</Option>
                  <Option value="100">100行/页</Option>
                </Select>
                {/* <div className={styles.floatRight}>行</div> */}
              </div>
              <Pagination
                total={this.state.workListPage.totalRecs}
                style={{ float: 'right' }}
                showQuickJumper
                showTotal={(total, range) =>
                  `共${total}条记录 第${this.state.workListPage.curpage}/${
                    this.state.workListPage.pageCounts
                  }页`
                }
                pageSize={this.state.pageSize}
                current={this.state.workListPage.curpage}
                onChange={this.onChange}
              />
            </div>
          </Form>
          <QueryWorkList
            wrappedComponentRef={this.saveQueryFormRef}
            visible={this.state.queryVisible}
            onCancel={this.queryCancel}
            onCreate={this.queryCreate}
            workListDetail={this.state.workListDetail}
            applicationlistDatas={this.state.applicationlistDatas}
          />
          <CreateWorkList
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            applicationlistDatas={this.state.applicationlistDatas}
          />
          <ReplayMessageList
            wrappedComponentRef={this.saveMessageFormRef}
            visible={this.state.replayMessageVisible}
            onCancel={this.replayMessageCancel}
            onCreate={this.replayMessageCreate}
            queryReplayDetail={this.state.queryReplayDetail}
            workState={this.state.workState}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

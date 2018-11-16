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
} from 'antd';
import styles from './Manage.less';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import jqy from 'jquery';
import { pageSize, readResultConst, messageTypeStatus, severityStatus } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import { DatePicker } from 'antd';
import UpdateMessageModal from './UpdateMessageModal.js';
import TextEllipsis from '../../components/TextEllipsis/TextEllipsis.js';
import '../../common.less';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/messagePage'],
}))
@Form.create()
export default class ManageMessage extends Component {
  constructor(props) {
    let resultKey = '';
    let resultLabel = '请选择';
    if (props.location.search != '') {
      resultKey = props.location.search.split('=')[1];
    }
    if (resultKey == 1) {
      resultLabel = '未读';
    } else if (resultKey == 0) {
      resultLabel = '已读';
    }
    super(props);
    this.state = {
      notice: '',
      model: { key: '' },
      subModel: { key: '' },
      messageType: { key: '' },
      severity: { key: '' },
      beginTime: '',
      endTime: '',
      readStateResult: { key: resultKey, label: resultLabel },
      modelListDatas: [],
      subModelListDatas: [],
      messageListData: [],
      messageListPage: {},
      subModelDisabled: true,
      selectedRowKeys: [],
      loading: false,
      noticeIds: [],
      editVisible: false,
      updataOfNoticeId: '',
      noticeResult: {},
      opinion: '',
      opinionChangeMark: false,
      defaultOpinion: '',
      pageSize: pageSize,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'manage/getModel',
      payload: {},
    });
    this.props.dispatch({
      type: 'manage/messagePage',
      payload: {
        searchParams: {
          model: this.state.model.key,
          subModel: this.state.subModel.key,
          result: this.state.readStateResult.key,
          beginTime: this.state.beginTime,
          endTime: this.state.endTime,
          message: this.state.notice,
          messageType: this.state.messageType.key,
          severity: this.state.severity.key,
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
    const next = nextProps.manage;
    if (next.returnType === 'getModelList' && next.resultCode == 1000) {
      this.setState({
        modelListDatas: next.modelListDatas,
      });
    }
    if (next.returnType === 'messagePageList' && next.resultCode == 1000) {
      this.setState({
        messageListData: next.messageListData,
        messageListPage: next.messageListPage,
        notice: document.getElementById('message').value,
      });
    }
    if (next.returnType === 'getSubModelList' && next.resultCode == 1000) {
      if (next.subModelListDatas.length == 0) {
        this.setState({
          subModelListDatas: [],
          subModelDisabled: true,
        });
      } else {
        this.setState({
          subModelListDatas: next.subModelListDatas,
          subModelDisabled: false,
        });
      }
    }
    if (next.returnType === 'updateRead' && next.resultCode == 1000) {
      if (this.state.editVisible == false) {
        message.success('信息已置为已读！');
        const location = window.location;
        if (location.href.indexOf('?') != -1) {
          const urlArr = location.href.split('?');
          window.location = urlArr[0];
        }
      }
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const {
        model,
        subModel,
        beginTime,
        endTime,
        notice,
        readStateResult,
        messageType,
        severity,
      } = this.state;
      this.props.dispatch({
        type: 'manage/messagePage',
        payload: {
          searchParams: {
            model: model.key,
            subModel: subModel.key,
            beginTime: beginTime,
            endTime: endTime,
            message: notice,
            result: readStateResult.key,
            messageType: messageType.key,
            severity: severity.key,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }
    if (next.returnType === 'queryNotice' && next.resultCode == 1000) {
      this.setState({
        noticeResult: next.noticeResult,
        defaultOpinion: next.noticeResult.opinion,
      });
    }
    if (next.returnType === 'updateNotice' && next.resultCode == 1000) {
      message.success('信息修改成功');
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const {
        model,
        subModel,
        beginTime,
        endTime,
        notice,
        readStateResult,
        messageType,
        severity,
      } = this.state;
      this.props.dispatch({
        type: 'manage/messagePage',
        payload: {
          searchParams: {
            model: model.key,
            subModel: subModel.key,
            beginTime: beginTime,
            endTime: endTime,
            message: notice,
            result: readStateResult.key,
            messageType: messageType.key,
            severity: severity.key,
          },
          page: {
            size: this.state.pageSize,
            curpage: currentPage,
          },
        },
      });
    }

    next.returnType = '';
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          model: { key: values.model.key },
          subModel: { key: values.subModel.key },
          notice: values.message,
          messageType: { key: values.messageType.key },
          severity: { key: values.severity.key },
          readStateResult: { key: values.result.key },
          beginTime: !!this.state.beginTimeMoment?this.state.beginTimeMoment:"",
          endTime: !!this.state.endTimeMoment?this.state.endTimeMoment:"",
        });
        this.props.dispatch({
          type: 'manage/messagePage',
          payload: {
            searchParams: {
              model: values.model.key,
              subModel: values.subModel.key,
              beginTime: !!this.state.beginTimeMoment?this.state.beginTimeMoment:"",
              endTime: !!this.state.endTimeMoment?this.state.endTimeMoment:"",
              message: values.message,
              result: values.result.key,
              messageType: values.messageType.key,
              severity: values.severity.key,
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
    const {
      model,
      subModel,
      beginTime,
      endTime,
      notice,
      readStateResult,
      messageType,
      severity,
    } = this.state;
    this.props.dispatch({
      type: 'manage/messagePage',
      payload: {
        searchParams: {
          model: model.key,
          subModel: subModel.key,
          beginTime: beginTime,
          endTime: endTime,
          message: notice,
          result: readStateResult.key,
          messageType: messageType.key,
          severity: severity.key,
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
    const {
      model,
      subModel,
      beginTime,
      endTime,
      notice,
      readStateResult,
      messageType,
      severity,
    } = this.state;
    this.props.dispatch({
      type: 'manage/messagePage',
      payload: {
        searchParams: {
          model: model.key,
          subModel: subModel.key,
          beginTime: beginTime,
          endTime: endTime,
          message: notice,
          result: readStateResult.key,
          messageType: messageType.key,
          severity: severity.key,
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };
  handleChangeModel = value => {
    // this.setState({
    //   model: value,
    // });
    this.props.form.setFields({
      subModel: {
        value: { key: '', label: '请选择' },
      },
    });

    if (value.key != 0) {
      this.props.dispatch({
        type: 'manage/getSubModel',
        payload: {
          model: value.key,
        },
      });
    } else {
      this.setState({
        subModelListDatas: [],
        subModelDisabled: true,
      });
    }
  };
  handleChangeSubModel = value => {
    // this.setState({
    //   subModel: value,
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
  messageCheckRead = () => {
    this.setState({ loading: true });
    const noticeIds = this.state.selectedRowKeys;
    this.props.dispatch({
      type: 'manage/updateRead',
      payload: noticeIds,
    });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
        noticeIds: noticeIds,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  // 查看信息详情 start
  viewMessageDetail = (record, index) => {
    jqy('#opinionLengthControl').text('');
    this.setState({
      editVisible: true,
      updataOfNoticeId: record.notice_id,
    });
    const readState = record.result;
    if (readState == 1) {
      this.props.dispatch({
        type: 'manage/updateRead',
        payload: [record.notice_id],
      });
    }
    setTimeout(() => {
      this.props.dispatch({
        type: 'manage/queryNotice',
        payload: {
          noticeId: record.notice_id,
        },
      });
    }, 500);
  };
  editCancel = () => {
    const form = this.editFormRef.props.form;
    form.resetFields();
    this.setState({ editVisible: false });
  };
  editCreate = e => {
    e.preventDefault();
    const form = this.editFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        // const opinion = this.state.opinionChangeMark ? this.state.opinion : this.state.defaultOpinion;
        const opinionRemind = jqy('#opinionLengthControl').text();
        if (!!opinionRemind) {
          return;
        } else {
          // if (this.state.opinionChangeMark && this.state.opinion != this.state.defaultOpinion) {
          this.editFormRef.props.dispatch({
            type: 'manage/updateNotice',
            payload: {
              noticeId: this.state.updataOfNoticeId,
              // opinion: this.state.opinion,
              opinion: values.opinion,
            },
          });
          form.resetFields();
          this.setState({ editVisible: false });
        }
      }
    });
  };
  saveEditFormRef = editFormRef => {
    this.editFormRef = editFormRef;
  };
  getOpinion = value => {
    this.setState({
      opinion: value,
      opinionChangeMark: true,
    });
  };
  // 查看信息详情 end

  handleChangeResult = value => {
    const location = window.location;
    if (location.href.indexOf('?') != -1) {
      const urlArr = location.href.split('?');
      // window.location = urlArr[0];
      this.props.dispatch(routerRedux.push('/manage/manage-message'));
    }
    // this.setState({
    //   readStateResult: value,
    // });
  };
  handleChangeMessageType = value => {
    // this.setState({
    //   messageType: value,
    // });
  };
  handleChangeSeverity = value => {
    // this.setState({
    //   severity: value,
    // });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.result === 0,
        name: `${record.result}`,
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const modelList = this.state.modelListDatas.map((modelListData, index) => (
      <Option value={modelListData.valueIndex} key={modelListData.valueIndex}>
        {modelListData.valueContent}
      </Option>
    ));
    let subModelList;
    if (this.state.subModelListDatas == []) {
      subModelList = '';
    } else {
      subModelList = this.state.subModelListDatas.map((subModelListData, index) => (
        <Option value={subModelListData.valueIndex} key={subModelListData.valueIndex}>
          {subModelListData.valueContent}
        </Option>
      ));
    }
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
        dataIndex: 'rowId',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '模块',
        dataIndex: 'modelName',
        align: 'center',
      },
      {
        title: '子模块',
        dataIndex: 'subModelName',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'result',
        align: 'center',
        render: (text, record, index) =>
          text == 1 ? (
            <div>
              <span className={`${styles.commonMark} ${styles.redMark}`} />
              {readResultConst[text]}
            </div>
          ) : (
            <div>
              <span className={`${styles.commonMark} ${styles.greenMark}`} />
              {readResultConst[text]}
            </div>
          ),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text, record, index) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '消息类型',
        dataIndex: 'messageType',
        align: 'center',
        render: (text, record, index) => messageTypeStatus[text],
      },
      {
        title: '严重程度',
        dataIndex: 'severity',
        align: 'center',
        render: (text, record, index) => severityStatus[text],
      },
      {
        title: '信息内容',
        dataIndex: 'message',
        align: 'center',
        // render: (text, record, index) => <div className={styles.alignLeft}>{text}</div>,
        render: (text, record, index) => (
          <TextEllipsis text={text} width={100} color="#02C3E6" cursor="pointer" />
        ),
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <a
            href="javascript:;"
            title="查看信息详情"
            onClick={() => {
              this.viewMessageDetail(record);
            }}
          >
            详情
          </a>
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
                  label="查询信息"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('message', {
                    initialValue: `${this.state.notice}`,
                  })(<Input placeholder="关键字" className={styles.antInputText} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="模块" style={{ width: 280, float: 'left' }}>
                  {getFieldDecorator('model', {
                    initialValue: { key: `${this.state.model.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeModel}
                    >
                      <Option value="">请选择</Option>
                      {modelList}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="子模块" style={{ width: 280, float: 'left' }}>
                  {getFieldDecorator('subModel', {
                    initialValue: { key: `${this.state.subModel.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeSubModel}
                      disabled={this.state.subModelDisabled}
                    >
                      <Option value="">请选择</Option>
                      {subModelList}
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
                  label="创建时间"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('searchTime')(<RangePicker onChange={this.searchTime} />)}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="状态" style={{ width: 280, float: 'left' }}>
                  {getFieldDecorator('result', {
                    initialValue: { key: `${this.state.readStateResult.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeResult}
                    >
                      <Option value="">请选择</Option>
                      <Option value="0">已读</Option>
                      <Option value="1">未读</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="消息类型"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('messageType', {
                    initialValue: { key: `${this.state.messageType.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeMessageType}
                    >
                      <Option value="">请选择</Option>
                      <Option value="1">告警信息</Option>
                      <Option value="2">工单通知</Option>
                      <Option value="3">普通消息</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="严重程度"
                  style={{ width: 280, float: 'left' }}
                >
                  {getFieldDecorator('severity', {
                    initialValue: { key: `${this.state.severity.key}` },
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '135' }}
                      labelInValue
                      onChange={this.handleChangeSeverity}
                    >
                      <Option value="">请选择</Option>
                      <Option value="1">一般</Option>
                      <Option value="2">严重</Option>
                      <Option value="3">危急</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem>
                  <TitleItem title="消息管理" />
                  <Popconfirm
                    title="是否标记为已读?"
                    onConfirm={this.messageCheckRead}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      className={styles.markBtn}
                      loading={loading}
                      type="primary"
                      disabled={!hasSelected}
                    >
                      标记为已读
                    </Button>
                    {/* disabled={!hasSelected} */}
                  </Popconfirm>
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.messageListData}
              bordered
              rowKey={record => record.notice_id}
              rowSelection={rowSelection}
              pagination={false}
              loading={this.props.submitting}
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
                total={this.state.messageListPage.totalRecs}
                style={{ float: 'right' }}
                showQuickJumper
                showTotal={(total, range) =>
                  `共${total}条记录 第${this.state.messageListPage.curpage}/${
                    this.state.messageListPage.pageCounts
                  }页`
                }
                pageSize={this.state.pageSize}
                current={this.state.messageListPage.curpage}
                onChange={this.onChange}
              />
            </div>
          </Form>
          <UpdateMessageModal
            wrappedComponentRef={this.saveEditFormRef}
            visible={this.state.editVisible}
            onCancel={this.editCancel}
            onCreate={this.editCreate}
            defaultdatas={this.state.noticeResult}
            getOpinion={this.getOpinion}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

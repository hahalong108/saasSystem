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
import styles from './Publish.less';
import logo from '../../assets/img/logo.svg';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import jqy from 'jquery';
import { pageSize, readResultConst } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import { DatePicker } from 'antd';
import UpdateMessageModal from '../Manage/UpdateMessageModal.js';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/getModel'],
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
      }
      var currentPage = jqy.trim(jqy('.ant-pagination-item-active a').text());
      if (currentPage == '' || currentPage == undefined) {
        currentPage = 1;
      }
      const { model, subModel, beginTime, endTime, notice, readStateResult } = this.state;
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
      const { model, subModel, beginTime, endTime, notice, readStateResult } = this.state;
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
        this.props.dispatch({
          type: 'manage/messagePage',
          payload: {
            searchParams: {
              model: values.model.key,
              subModel: values.subModel.key,
              beginTime: this.state.beginTime,
              endTime: this.state.endTime,
              message: values.message,
              result: values.result.key,
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
    const { model, subModel, beginTime, endTime, notice, readStateResult } = this.state;
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
    const { model, subModel, beginTime, endTime, notice, readStateResult } = this.state;
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
        },
        page: {
          size: value,
          curpage: 1,
        },
      },
    });
  };
  handleChangeModel = value => {
    this.setState({
      model: value,
    });
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
    this.setState({
      subModel: value,
    });
  };
  searchTime = (date, dateString) => {
    this.setState({
      beginTime: dateString[0],
      endTime: dateString[1],
    });
  };
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
        const opinion = this.state.opinionChangeMark
          ? this.state.opinion
          : this.state.defaultOpinion;
        this.editFormRef.props.dispatch({
          type: 'manage/updateNotice',
          payload: {
            noticeId: this.state.updataOfNoticeId,
            opinion: opinion,
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
  getOpinion = value => {
    this.setState({
      opinion: value,
      opinionChangeMark: true,
    });
  };
  // 查看信息详情 end

  handleChangeResult = value => {
    this.setState({
      readStateResult: value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
        render: (text, record, index) => readResultConst[text],
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text, record, index) => timestampToTime(text),
      },
      {
        title: '信息',
        dataIndex: 'message',
        align: 'center',
        render: (text, record, index) => (
          <a
            href="javascript:;"
            title="查看信息详情"
            onClick={() => {
              this.viewMessageDetail(record);
            }}
          >
            {text}
          </a>
        ),
      },
    ];
    return (
      <div className={styles.container}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <Row style={{ width: '100%' }}>
            <Col>
              <FormItem {...formItemLayout} label="应用名称" style={{ width: 300, float: 'left' }}>
                {getFieldDecorator('message', {
                  initialValue: `${this.state.notice}`,
                })(<Input placeholder="关键字" className={styles.antInputText} />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="模块" style={{ width: 300, float: 'left' }}>
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
              <FormItem {...formItemLayout} label="子模块" style={{ width: 300, float: 'left' }}>
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
              <FormItem {...formItemLayout} label="时间" style={{ width: 300, float: 'left' }}>
                {getFieldDecorator('searchTime')(<RangePicker onChange={this.searchTime} />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="状态" style={{ width: 300, float: 'left' }}>
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
          </Row>
          <Row style={{ width: '100%' }}>
            <Col>
              <FormItem>
                <TitleItem title="告警管理" />
                <Popconfirm
                  title="是否全部标记为已读?"
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
    );
  }
}

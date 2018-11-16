import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col, Table, Select, Pagination } from 'antd';
import styles from './Manage.less';
import { connect } from 'dva';
import { pageSize, resultNameConst, operationNameConst } from '../../common.js';
import TitleItem from '../../components/common/TitleItem.js';
import { DatePicker } from 'antd';
import '../../common.less';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/logPage'],
}))
@Form.create()
export default class ManageLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: { key: 0 },
      subModel: { key: 0 },
      beginTime: '',
      endTime: '',
      modelListDatas: [],
      subModelListDatas: [],
      logListData: [],
      logListPage: {},
      subModelDisabled: true,
      pageSize: pageSize,
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'manage/getModel',
      payload: {},
    });
    this.props.dispatch({
      type: 'manage/logPage',
      payload: {
        searchParams: {
          model: this.state.model.key,
          subModel: this.state.subModel.key,
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
    const next = nextProps.manage;
    if (next.returnType === 'getModelList' && next.resultCode == 1000) {
      this.setState({
        modelListDatas: next.modelListDatas,
      });
    }
    if (next.returnType === 'logPageList' && next.resultCode == 1000) {
      this.setState({
        logListData: next.logListData,
        logListPage: next.logListPage,
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
    next.returnType = '';
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          model: { key: values.model.key },
          subModel: { key: values.subModel.key },
          beginTime: !!this.state.beginTimeMoment?this.state.beginTimeMoment:"",
          endTime: !!this.state.endTimeMoment?this.state.endTimeMoment:"",
        });
        this.props.dispatch({
          type: 'manage/logPage',
          payload: {
            searchParams: {
              model: values.model.key,
              subModel: values.subModel.key,
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
    const { model, subModel, beginTime, endTime } = this.state;
    this.props.dispatch({
      type: 'manage/logPage',
      payload: {
        searchParams: {
          model: model.key,
          subModel: subModel.key,
          beginTime: beginTime,
          endTime: endTime,
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
    const { model, subModel, beginTime, endTime } = this.state;
    this.props.dispatch({
      type: 'manage/logPage',
      payload: {
        searchParams: {
          model: model.key,
          subModel: subModel.key,
          beginTime: beginTime,
          endTime: endTime,
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
        value: { key: 0, label: '请选择' },
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


  render() {
    const { getFieldDecorator } = this.props.form;
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
        title: '用户名称',
        dataIndex: 'userName',
        align: 'center',
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
        title: '返回状态',
        dataIndex: 'resultName',
        align: 'center',
        render: (text, record, index) => resultNameConst[text],
      },
      {
        title: '执行操作',
        dataIndex: 'operationName',
        align: 'center',
        render: (text, record, index) => text,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text, record, index) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '查询信息',
        dataIndex: 'message',
        align: 'center',
      },
    ];
    return (
      <PageHeaderLayout>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row style={{ width: '100%' }}>
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
                      <Option value="0">请选择</Option>
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
                      <Option value="0">请选择</Option>
                      {subModelList}
                    </Select>
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
                  <TitleItem title="日志管理" />
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.logListData}
              bordered
              rowKey={record => record.createTime+Math.random()*100}
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
                total={this.state.logListPage.totalRecs}
                style={{ float: 'right' }}
                showQuickJumper
                showTotal={(total, range) =>
                  `共${total}条记录 第${this.state.logListPage.curpage}/${
                    this.state.logListPage.pageCounts
                  }页`
                }
                pageSize={this.state.pageSize}
                current={this.state.logListPage.curpage}
                onChange={this.onChange}
              />
            </div>
          </Form>
        </div>
      </PageHeaderLayout>
    );
  }
}

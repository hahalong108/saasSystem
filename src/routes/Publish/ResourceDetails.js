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
import { PieCharts } from '../../components/Publish/PieCharts';
import { LineCharts } from '../../components/Publish/LineCharts';

import TitleItem from '../../components/common/TitleItem.js';
import styles from './Publish.less';
import '../../common.less';
import { DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ publish, loading }) => ({
  publish,
  // submitting: loading.effects['publish/initResource'],
}))
@Form.create()
export default class ResourceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDate: [],
      cpuLoad: {},
      cpuUtilization: {},
      diskSpaceusag: {},
      diskSpaceusagBoot: {},
      diskSpaceusagData: {},
      memoryUsage: {},
      networkTrafficoneth0: {},
      swapUsage: {},
      softwareinfos: [],
    };
  }

  componentWillMount() {
    if (!!this.props.location.state) {
      const serverId = this.props.location.state.serverId;
      this.props.dispatch({
        type: 'publish/queryIplist',
        payload: {
          serverId: serverId,
        },
      });
      this.props.dispatch({
        type: 'publish/softwareinfos',
        payload: {
          serverId: serverId,
        },
      });
    } else {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/publish/manage-resource',
        })
      );
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'queryIplist' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        selectDate: next.data,
      });
      this.changeCharts(next.data[0]);
    }
    if (next.returnType === 'cpuLoad' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        cpuLoad: next.data,
      });
    }
    if (next.returnType === 'cpuUtilization' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        cpuUtilization: next.data,
      });
    }
    if (next.returnType === 'diskSpaceusag' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        diskSpaceusag: next.data,
      });
    }
    if (next.returnType === 'diskSpaceusagBoot' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        diskSpaceusagBoot: next.data,
      });
    }
    if (next.returnType === 'diskSpaceusagData' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        diskSpaceusagData: next.data,
      });
    }
    if (next.returnType === 'memoryUsage' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        memoryUsage: next.data,
      });
    }
    if (next.returnType === 'networkTrafficoneth0' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        networkTrafficoneth0: next.data,
      });
    }
    if (next.returnType === 'swapUsage' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        swapUsage: next.data,
      });
    }
    if (next.returnType === 'softwareinfos' && next.resultCode === 1000) {
      next.resultCode = 0;
      this.setState({
        softwareinfos: next.data,
      });
    }
    if (next.returnType === 'restartService' && next.resultCode === 1000) {
      next.resultCode = 0;
      message.success('重启成功');
    }
    if (next.returnType === 'restartService' && next.resultCode !== 1000) {
      next.resultCode = 0;
      message.success(next.desc);
    }
  }

  changeCharts = ip => {
    this.props.dispatch({
      type: 'publish/cpuLoad',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/cpuUtilization',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/diskSpaceusag',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/diskSpaceusagBoot',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/diskSpaceusagData',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/memoryUsage',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/networkTrafficoneth0',
      payload: {
        ip: ip,
      },
    });
    this.props.dispatch({
      type: 'publish/swapUsage',
      payload: {
        ip: ip,
      },
    });
  };
  restartService = id => {
    console.log(id);
    this.props.dispatch({
      type: 'publish/restartService',
      payload: {
        softwareId: id,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.changeCharts(values.selectIp);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const TabPane = Tabs.TabPane;
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
        title: '软件名称',
        dataIndex: 'monitorName',
        key: 'monitorName',
      },
      {
        title: '主机IP',
        dataIndex: 'hostIp',
        key: 'hostIp',
      },
      {
        title: '服务端口',
        dataIndex: 'servicePort',
        key: 'servicePort',
      },
      {
        title: '服务状态',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: '操作',
        dataIndex: 'station',
        key: 'station',
        align: 'center',
        render: (text, record) => (
          <span>
            <Button
              type="primary"
              size="small"
              onClick={this.restartService.bind(this, record.softwareId)}
              disabled={record.state === 'down' ? false : true}
            >
              重启
            </Button>
          </span>
        ),
      },
    ];

    const optionData = this.state.selectDate;
    const optionDoms = [];
    optionData.forEach(item => {
      const key = item;
      const val = item;
      optionDoms.push(<Option key={key}>{val}</Option>);
      return optionDoms;
    });

    const prefixSelector = getFieldDecorator('selectIp', {
      initialValue: optionData[0],
    })(<Select>{optionDoms}</Select>);

    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1">
          <TabPane tab="资源数据图表" key="1">
            <Form hideRequiredMark>
              <Row style={{ width: '100%' }}>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    style={{ width: 300, float: 'left' }}
                    label="IP地址"
                    // hasFeedback
                  >
                    {prefixSelector}
                  </FormItem>
                </Col>
                <Col>
                  <FormItem style={{ float: 'right' }}>
                    <Button
                      icon="search"
                      type="primary"
                      className={styles.btn}
                      htmlType="submit"
                      onClick={this.handleSubmit}
                    >
                      查询
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className={styles.resourceDetailsCharts}>
              <Row>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <LineCharts
                    data={this.state.cpuLoad}
                    titleText="资源数据 CPULOAD"
                    areaStyle={false}
                    pieces=""
                  />
                </Col>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <LineCharts
                    data={this.state.cpuUtilization}
                    titleText="资源数据 CPUUTILIZATION"
                    areaStyle={true}
                    pieces="%"
                  />
                </Col>
                <Col span={8}>
                  <LineCharts
                    data={this.state.memoryUsage}
                    titleText="资源数据 MEMORYUSAGE"
                    areaStyle={true}
                    pieces="GB"
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <PieCharts
                    data={this.state.diskSpaceusagBoot}
                    titleText="资源数据 DISKSPACEUSAGEBOOT"
                  />
                </Col>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <PieCharts
                    data={this.state.diskSpaceusagData}
                    titleText="资源数据 DISKSPACEUSAGEDATA"
                  />
                </Col>
                <Col span={8}>
                  <PieCharts data={this.state.diskSpaceusag} titleText="资源数据 DISKSPACEUSAGE" />
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <LineCharts
                    data={this.state.networkTrafficoneth0}
                    titleText="资源数据 NETWORKTRAFFICONETH0"
                    areaStyle={true}
                    pieces=""
                  />
                </Col>
                <Col span={8} style={{ paddingRight: 16 }}>
                  <PieCharts data={this.state.swapUsage} titleText="资源数据 SWAPUSAGE" />
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane tab="资源数据列表" key="2">
            <TitleItem title="资源管理" />
            <Table columns={columns} dataSource={this.state.softwareinfos} pagination={false} />
          </TabPane>
        </Tabs>
      </PageHeaderLayout>
    );
  }
}

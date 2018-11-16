import React, { Component } from 'react';
import { Form, Icon, Input, Button, Row, Col, Table, Select, message } from 'antd';
import styles from './Manage.less';
import { connect } from 'dva';
import TitleItem from '../../components/common/TitleItem.js';
import '../../common.less';
import EditSysValue from './EditSysValue.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/sysSetting'],
}))
@Form.create()
export default class SystemConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sysSettingDatas: [],
      editVisible: false,
      sysItemData: {},
      optionList: '',
      sysId: '',
      defaultEle: '',
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'manage/sysSetting',
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.manage;
    if (next.returnType === 'sysSetting' && next.resultCode == 1000) {
      this.setState({
        sysSettingDatas: next.resultData,
      });
    }
    if (next.returnType === 'getSetting' && next.resultCode == 1000) {
      this.setState({
        sysItemData: next.resultData,
        optionList: next.resultData.sysJson,
      });
    }
    if (next.returnType === 'updateSetting' && next.resultCode == 1000) {
      message.success('系統配置已更新！');
      this.props.dispatch({
        type: 'manage/sysSetting',
      });
    }
    next.returnType = '';
  }

  // 修改用户 start
  editSysValue = (record, index) => {
    this.setState({
      editVisible: true,
      sysId: record.sysId,
      defaultEle: record.sysValue,
    });
    this.props.dispatch({
      type: 'manage/getSetting',
      payload: {
        sysId: record.sysId,
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
          type: 'manage/updateSetting',
          payload: {
            sysId: this.state.sysId,
            sysValue: values.sysValue.key,
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
  // 修改用户 end

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'rowId',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '项目名称',
        dataIndex: 'sysName',
        align: 'center',
      },
      {
        title: '项目描述',
        dataIndex: 'sysDesc',
        align: 'center',
      },
      {
        title: '配置值',
        dataIndex: 'sysValue',
        align: 'center',
        render: (text, record, index) => text,
      },
      {
        title: '操作',
        dataIndex: 'done',
        align: 'center',
        render: (text, record, index) => (
          <a
            href="javascript:;"
            title="修改配置值"
            onClick={() => {
              this.editSysValue(record);
            }}
          >
            <Icon type="form" />
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
                <FormItem>
                  <TitleItem title="系统配置" />
                </FormItem>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={this.state.sysSettingDatas}
              bordered
              rowKey={record => record.sysId}
              pagination={false}
              loading={this.props.submitting}
            />
          </Form>
          <EditSysValue
            wrappedComponentRef={this.saveEditFormRef}
            defaultdatas={this.state.sysItemData}
            visible={this.state.editVisible}
            onCancel={this.editCancel}
            onCreate={this.editCreate}
            optionList={this.state.optionList}
            defaultEle={this.state.defaultEle}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

import { Button, Modal, Form, Input, Select, Table, Popconfirm, Upload, message, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import './Document.less';

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/getAppId'],
}))
@Form.create()
export default class CreateNewDocumentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: { key: '0' },
      versionId: { key: '0' },
      versionIdDatas: [],
      versionIdDisabled: true,
      dataSource: props.dataSource,
      indexTag: 1,
      showOrNot: false,
    };
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({ dataSource: nextProps.dataSource });
    }
    const next = nextProps.publish;
    if (next.returnType === 'getVersionId' && next.resultCode == 1000) {
      if (next.resultData.length == 0) {
        this.setState({
          versionIdDatas: [],
          versionIdDisabled: true,
        });
      } else {
        this.setState({
          versionIdDatas: next.resultData,
          versionIdDisabled: false,
        });
      }
    }
    next.returnType = '';
  }

  handleChangeAppId = value => {
    this.setState({
      appId: value,
    });
    this.props.form.setFields({
      versionId: {
        value: { key: '0', label: '请选择' },
      },
    });
    if (value.key != '0') {
      this.props.dispatch({
        type: 'publish/getVersionId',
        payload: {
          appId: value.key,
        },
      });
    } else {
      this.setState({
        versionIdDatas: [],
        versionIdDisabled: true,
      });
    }
  };
  handleChangeVersionId = value => {
    this.setState({
      versionId: value,
    });
  };
  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      documentType: { key: '0' },
      fileId: '',
      indexTag: this.state.indexTag,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      indexTag: this.state.indexTag + 1,
    });
    this.props.form.setFields({
      addDocument: {
        errors: [new Error('')],
      },
    });
  };
  handleChangeDocumentType = value => {};
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter(item => item.indexTag !== key),
    });
  };

  handleChange = info => {
    if (info.fileList.length > 1) {
      info.fileList.splice(0, info.fileList.length - 1);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功！`);
      this.setState({
        showOrNot: true,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败！`);
      info.fileList.splice(0, info.fileList.length);
      this.setState({
        showOrNot: false,
      });
    } else if (!info.file.status) {
      info.fileList.splice(0, info.fileList.length);
      this.setState({
        showOrNot: false,
      });
    }
  };

  beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('上传文件不能超过10MB!');
    }
    return isLt10M;
  };

  confirmFileUpload = (rule, value, callback) => {
    if (value && value.fileList.length == 0) {
      callback('请选择您要上传的文件！');
    }
    callback();
  };

  render() {
    const { visible, onCancel, onCreate, form, appIdDatas, dictListDatas } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const appIdList = appIdDatas.map((appIdData, index) => (
      <Option value={appIdData.appId} key={appIdData.appId}>
        {appIdData.appName}
      </Option>
    ));
    const versionIdList = this.state.versionIdDatas.map((versionIdData, index) => (
      <Option value={versionIdData.versionId} key={versionIdData.versionId}>
        {versionIdData.versionName}
      </Option>
    ));
    const dictList = dictListDatas.map((dictListData, index) => (
      <Option value={dictListData.valueIndex} key={dictListData.valueIndex}>
        {dictListData.valueContent}
      </Option>
    ));

    const props = {
      name: 'file',
      action: '/api/saas-server/file/upload',
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      multiple: false,
      listType: 'text',
      accept: 'application/pdf',
      showUploadList: this.state.showOrNot,
    };
    const columns = [
      {
        title: '编号',
        dataIndex: 'rowId',
        align: 'center',
        width: 80,
        render: (text, record, index) => index + 1,
      },
      {
        title: '文档类型',
        dataIndex: 'documentType',
        align: 'center',
        width: 150,
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator('documentType' + record.indexTag, {
              // initialValue: { key: "0" },
              rules: [
                {
                  required: true,
                  message: '请选择文档类型！',
                },
              ],
            })(
              <Select placeholder="请选择" labelInValue onChange={this.handleChangeDocumentType}>
                {/* <Option value="0">请选择</Option> */}
                {dictList}
              </Select>
            )}
          </FormItem>
        ),
      },
      {
        title: '文件上传',
        dataIndex: 'fileId',
        align: 'center',
        width: 220,
        render: (text, record, index) => (
          <FormItem>
            {getFieldDecorator('fileId' + record.indexTag, {
              rules: [
                {
                  required: true,
                  message: '请选择您要上传的文件！',
                },
                {
                  validator: this.confirmFileUpload,
                },
              ],
            })(
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 上传
                </Button>
              </Upload>
            )}
          </FormItem>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          return this.state.dataSource.length > 0 ? (
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.indexTag)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];
    return (
      <Modal
        visible={visible}
        title="新增文档信息"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
        width={600}
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appId', {
              // initialValue: { key: `${this.state.appId.key}` },
              rules: [
                {
                  required: true,
                  message: '请选择应用名称！',
                },
              ],
            })(
              <Select placeholder="请选择" labelInValue onChange={this.handleChangeAppId}>
                {/* <Option value="0">请选择</Option> */}
                {appIdList}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="版本号">
            {getFieldDecorator('versionId', {
              // initialValue: { key: `${this.state.versionId.key}` },
              rules: [
                {
                  required: true,
                  message: '请选择应用版本号！',
                },
              ],
            })(
              <Select
                placeholder="请选择"
                labelInValue
                onChange={this.handleChangeVersionId}
                disabled={this.state.versionIdDisabled}
                defaultActiveFirstOption={true}
              >
                {/* <Option value="0">请选择</Option> */}
                {versionIdList}
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('addDocument')(
              <Button onClick={this.handleAdd}>
                <Icon type="plus" />添加新文档
              </Button>
            )}
          </FormItem>
          <FormItem>
            <Table
              columns={columns}
              dataSource={this.state.dataSource}
              bordered
              rowKey={record => record.indexTag.toString()}
              pagination={false}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

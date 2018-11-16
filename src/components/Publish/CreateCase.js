import { Upload, message, Button, Icon, Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import '../../common.less';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import jqy from 'jquery';

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/applicationPage'],
}))
@Form.create()
export default class CreateCase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      caseZipFileId: '',
      fileList: [],
      fileShow: false,
      applicationlistDatas: [],
    };
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible === false){
      this.setState({
        caseZipFileId: '',
        fileList: [],
        fileShow: false,
      });
    }
    const next = nextProps.publish;
    if (next.returnType === 'applicationlist' && next.resultCode === 1000) {
      next.returnType = '';
      this.setState({
        applicationlistDatas: next.data,
      });
    }
    if (next.returnType === 'createCase' && next.resultCode === 1000) {
      next.returnType = '';
      this.props.form.resetFields();
      this.setState({
        caseZipFileId: '',
        fileList: [],
        fileShow: false,
      });
    }
  }

  fileChange = value => {
    if (!value.file.status) {
      value.fileList.splice(0, 1);
      this.setState({
        fileShow: false,
      });
    }else if (value.file.status === 'error') {
      message.error('文件上传失败');
      value.fileList.splice(0, 1);
      this.setState({
        fileShow: false,
      });
    }
    if (value.file.status === 'error') {
      message.error('文件上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('文件上传失败');
        return false;
      }
      this.setState({
        caseZipFileId: value.file.response.data.fileId,
        fileShow: true,
      });
      if (value.fileList.length > 1) {
        value.fileList.splice(0, 1);
      }
    }
    this.setState({
      fileList: [...value.fileList],
    });
  };
  fileBeforeUpload = file => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //     message.error('You can only upload JPG file!');
    // }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('文件上传不能超过20M!');
      return false;
    }
    this.setState({
      fileShow: true,
    });
  };
  fileRemove = file => {
    this.setState({
      caseZipFileId: '',
    });
    setTimeout(() => {
      this.props.form.setFields({
        caseZipFileId: {
          value: '',
          errors: [new Error('请上传案例内容文件！')],
        },
      });
    }, 500);
  };

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    const { TextArea } = Input;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const appList = [];
    const applicationlist = this.state.applicationlistDatas.map((applicationlistData, index) => {
      appList.push(
        <Option value={applicationlistData.appId} key={applicationlistData.appId}>
          {applicationlistData.appName}
        </Option>
      );
      return appList;
    });
    const file = {
      accept: '.zip',
      action: '/api/saas-server/file/upload',
      // action: 'http://192.168.252.210:8888/saas-server/file/upload',
      name: 'file',
      listType: 'text',
      beforeUpload: this.fileBeforeUpload,
      showUploadList: this.state.fileShow,
      onChange: this.fileChange,
      onRemove: this.fileRemove,
      fileList: [...this.state.fileList],
    };

    return (
      <Modal
        visible={visible}
        title="新增案例信息"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate.bind(this, this.state.caseZipFileId)}
        destroyOnClose
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appId', {
              rules: [
                {
                  required: true,
                  message: '请选择应用名称',
                },
              ],
            })(<Select placeholder="请选择">{appList}</Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="案例名称">
            {getFieldDecorator('caseName', {
              rules: [
                {
                  required: true,
                  message: '请输入案例名称！',
                },
                { max: 40, message: '案例名称长度不能超过40个字符!' },
              ],
            })(<Input placeholder="案例名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="案例内容">
            {getFieldDecorator('caseZipFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传案例内容文件！',
                },
              ],
            })(
              <Upload {...file}>
                <Button>
                  <Icon type="upload" /> 上传文件
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

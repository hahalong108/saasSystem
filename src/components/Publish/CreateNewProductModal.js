import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  Select,
  Cascader,
  TextArea,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import '../../common.less';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import jqy from 'jquery';

@connect(({ publish, loading, user }) => ({
  publish,
  submitting: loading.effects['publish/applicationPage'],
  currentUser: user.currentUser,
}))
@Form.create()
export default class CreateNewProductModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      logoFileId: '',
      fileId: '',
      logoList: [],
      fileList: [],
      logoShow: false,
      fileShow: false,
      btnTag: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.btnTag === '新增' && this.state.btnTag !== '新增') {
      this.setState({
        logoShow: false,
        fileShow: false,
      });
    }
    this.setState({
      btnTag: nextProps.btnTag,
    });
    const next = nextProps.publish;
    if (next.returnType === 'queryUser' && next.resultCode === 1000) {
      this.setState({
        data: next.resultData,
      });
    }
    if (next.returnType === 'createProduct' && next.resultCode === 1000) {
      this.setState({
        logoShow: false,
        fileShow: false,
      });
    }
    if (next.returnType === 'updateProduct' && next.resultCode === 1000) {
      this.setState({
        logoShow: false,
        fileShow: false,
      });
    }
    if (next.returnType === 'queryProduct' && next.resultCode == 1000) {
      let data = next.data;
      this.props.form.setFieldsValue({
        appName: data.appName,
        appShortName: data.appShortName,
        userId: data.userId,
        departmentName: data.departmentName,
        departmentId: data.departmentId,
        logoFileId: data.logoFileId,
        detailPageZipFileId: data.detailPageZipFileId,
        appDescription: data.appDescription,
      });
      this.setState({
        data: [
          {
            userId: data.userId,
            userMail: data.userMail,
          },
        ],
        logoFileId: data.logoFileId,
        fileId: data.detailPageZipFileId,
        logoList: [
          {
            uid: '-2',
            // name: data.logoFile.fileName,
            name: data.logoFile.fileName,
            status: 'done',
            url: `/api/saas-file/${data.logoFile.path}`,
            thumbUrl: `/api/saas-file/${data.logoFile.path}`,
          },
        ],
        fileList: [
          {
            uid: '-1',
            // name: data.logoFile.fileName,
            name: data.detailPageZipFile.fileName,
            status: 'done',
            url: `/api/saas-file/${data.detailPageZipFile.path}`,
            thumbUrl: `/api/saas-file/${data.detailPageZipFile.path}`,
          },
        ],
        logoShow: true,
        fileShow: true,
      });
      next.resultCode = 0;
    }
  }

  picChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
    }
    if (value.file.status === 'error') {
      message.error('LOGO上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('LOGO上传失败');
        return false;
      }
      this.setState({
        logoFileId: value.file.response.data.fileId,
        logoShow: true,
      });
    }
    this.setState({
      logoList: [...value.fileList],
    });
  };
  fileChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
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
        fileId: value.file.response.data.fileId,
        fileShow: true,
      });
    }
    this.setState({
      fileList: [...value.fileList],
    });
  };
  logoBeforeUpload = file => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //     message.error('You can only upload JPG file!');
    // }
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('LOGO图片上传不能超过1M!');
      return false;
    }
    this.setState({
      logoShow: true,
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
  logoRemove = file => {
    this.setState({
      logoFileId: '',
    });
    // this.props.form.setFieldsValue({
    //     logoFileId:null,
    // })
    setTimeout(() => {
      this.props.form.setFields({
        logoFileId: {
          value: '',
          errors: [new Error('请上传LOGO文件！')],
        },
      });
    }, 500);
  };
  fileRemove = file => {
    this.setState({
      fileId: '',
    });
    setTimeout(() => {
      this.props.form.setFields({
        detailPageZipFileId: {
          value: '',
          errors: [new Error('请上传展示说明文件')],
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

    const optionData = this.state.data;
    const optionDoms = [];
    optionData.forEach(item => {
      const key = item.userId;
      const val = item.userMail;
      optionDoms.push(<Option key={key}>{val}</Option>);
      return optionDoms;
    });
    // const logoList = [{
    //     uid: '-2',
    //     name: 'xxx.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }];
    // const fileList = [{
    //     uid: '-2',
    //     name: 'xxx.png',
    //     status: 'done',
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }];
    const logo = {
      accept: ['.png', '.jpg'],
      action: '/api/saas-server/file/upload',
      name: 'file',
      listType: 'picture',
      beforeUpload: this.logoBeforeUpload,
      showUploadList: this.state.logoShow,
      onChange: this.picChange,
      onRemove: this.logoRemove,
      fileList: [...this.state.logoList],
    };
    const file = {
      accept: '.zip',
      action: '/api/saas-server/file/upload',
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
        title={`${this.state.btnTag === '新增' ? '新增' : '修改'}应用信息`}
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate.bind(this, [this.state.logoFileId, this.state.fileId])}
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appName', {
              rules: [
                {
                  required: true,
                  message: '请输入应用名称！',
                },
                { max: 100, message: '应用名称长度不能超过100个字符!' },
              ],
            })(<Input placeholder="应用名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="应用简称">
            {getFieldDecorator('appShortName', {
              rules: [
                {
                  required: true,
                  message: '请输入应用简称！',
                },
                { max: 40, message: '应用简称长度不能超过40个字符!' },
              ],
            })(
              <Input
                placeholder="应用简称"
                disabled={this.state.btnTag[1] === '修改' ? true : false}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="管理员">
            {getFieldDecorator('userMail', {
              initialValue: this.props.currentUser.userMail,
            })(<Input disabled />)}
            {getFieldDecorator('userId', {
              initialValue: this.props.currentUser.userId,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所属部门">
            {getFieldDecorator('departmentName', {
              initialValue: this.props.currentUser.departmentName,
            })(<Input disabled />)}
            {getFieldDecorator('departmentId', {
              initialValue: this.props.currentUser.departmentId,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="LOGO" extra="">
            {getFieldDecorator('logoFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传LOGO文件！',
                },
              ],
            })(
              <Upload {...logo}>
                <Button>
                  <Icon type="upload" /> 上传图片
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="展示说明">
            {getFieldDecorator('detailPageZipFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传展示说明文件！',
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
          <FormItem {...formItemLayout} label="应用描述">
            {getFieldDecorator('appDescription', {
              rules: [
                {
                  required: true,
                  message: '请输入应用描述！',
                },
                { max: 100, message: '应用描述长度不能超过100个字符!' },
              ],
            })(<TextArea placehoder="请输入应用描述" style={{ height: '73px' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

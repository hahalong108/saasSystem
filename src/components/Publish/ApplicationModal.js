import {
  Upload,
  message,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Cascader,
  TextArea,
  Row,
  Col,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import style from './Publish.less';
import '../../common.less';
import ApplicationPrice from './ApplicationPrice';

import { createForm } from 'rc-form';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import $ from 'jquery';
import { initResource } from '../../services/api';

@connect(({ publish, loading }) => ({
  publish,
  //submitting: loading.effects['publish/applicationPageDetails'],
}))
@Form.create()
export default class ApplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      configFileId: '',
      configFileList: [],
      configFileShow: false,
      deploymentFileId: '',
      deploymentFileList: [],
      deploymentFileShow: false,
      customFileId: '',
      customFileList: [],
      customFileShow: false,
      upgradeSqlFileId: '',
      upgradeSqlFileList: [],
      upgradeSqlFileShow: false,
      // priceSource : [{
      //     key: 0,
      //     name: '请输入名称！',
      //     tag: '请输入标签！',
      //     value: '请输入值！',
      // }],
      priceSource: [],
      btnTag: '',
      PriceVisible: false,

      // priceList:[
      //     {
      //         "configJson": "[{\"name\":\"账簿\",\"tag\":\"books\",\"value\":\"200\"},{\"name\":\"人数\",\"tag\":\"peopleNum\",\"value\":\"1000\"},{\"name\":\"人数\",\"tag\":\"peopleNum\",\"value\":\"1000\"},{\"name\":\"人数\",\"tag\":\"peopleNum\",\"value\":\"1000\"}]",
      //         "price": 800,
      //         "versionId": "402889cb6464803f0164648078540000",
      //         "versionPriceId": "402889cb6464803f0164649a387b0005"
      //     },
      //     {
      //         "configJson": "[{\"name\":\"账簿11\",\"tag\":\"books\",\"value\":\"400\"},{\"name\":\"人数\",\"tag\":\"peopleNum\",\"value\":\"3000\"}]",
      //         "price": 1500,
      //         "versionId": "402889cb6464803f0164648078540000",
      //         "versionPriceId": "402889cb6464803f0164649a388c0006"
      //     },
      //     {
      //         "configJson": "[{\"name\":\"账簿11\",\"tag\":\"books\",\"value\":\"400\"},{\"name\":\"人数\",\"tag\":\"peopleNum\",\"value\":\"3000\"}]",
      //         "price": 1500,
      //         "versionId": "402889cb6464803f0164648078540000",
      //         "versionPriceId": "402889cb6464803f0164649a388c0006"
      //     }
      // ],
      priceList: [],
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.btnTag === '新增' && nextProps.btnTagFirst) {
      this.setState({
        configFileShow: false,
        deploymentFileShow: false,
        customFileShow: false,
        upgradeSqlFileShow: false,
        priceList: [],
      });
    }
    this.setState({
      btnTag: nextProps.btnTag,
    });
    const next = nextProps.publish;
    if (next.returnType === 'queryUser' && next.resultCode == 1000) {
      this.setState({
        data: next.resultData,
      });
      next.resultCode = 0;
    }
    if (next.returnType === 'queryApplication' && next.resultCode === 1000) {
      let data = next.data;
      this.props.form.setFieldsValue({
        versionName: data.versionName,
        configFileId: data.configFileId,
        adminId: data.adminId,
        limitTotal: data.limitTotal,
        deploymentFileId: data.deploymentFileId,
        customFileId: data.customFileId,
        upgradeSqlFileId: data.upgradeSqlFileId,
        versionDesc: data.versionDesc,
      });
      this.setState({
        data: [
          {
            userId: data.adminId,
            userMail: data.adminMail,
          },
        ],
        configFileId: data.configFileId,
        configFileList: [
          {
            uid: '-1',
            name: data.configFile.fileName,
            status: 'done',
            url: `/api/saas-file/${data.configFile.path}`,
            thumbUrl: `/api/saas-file/${data.configFile.path}`,
          },
        ],
        configFileShow: true,
        deploymentFileId: data.deploymentFileId,
        deploymentFileList: [
          {
            uid: '-2',
            name: data.deploymentFile.fileName,
            status: 'done',
            url: `/api/saas-file/${data.deploymentFile.path}`,
            thumbUrl: `/api/saas-file/${data.deploymentFile.path}`,
          },
        ],
        deploymentFileShow: true,
        customFileId: data.customFileId,
        customFileList: [
          {
            uid: '-3',
            name: data.customFile.fileName,
            status: 'done',
            url: `/api/saas-file/${data.customFile.path}`,
            thumbUrl: `/api/saas-file/${data.customFile.path}`,
          },
        ],
        customFileShow: true,
        upgradeSqlFileId: data.upgradeSqlFileId,
        priceList: data.priceList,
      });
      if (!!data.upgradeSqlFileId) {
        this.setState({
          upgradeSqlFileList: [
            {
              uid: '-4',
              name: data.customFile.fileName,
              status: 'done',
              url: `/api/saas-file/${data.customFile.path}`,
              thumbUrl: `/api/saas-file/${data.customFile.path}`,
            },
          ],
          upgradeSqlFileShow: true,
        });
      }
      next.resultCode = 0;
    }

    if (next.returnType === 'createApplication' && next.resultCode == 1000) {
      this.setState({
        configFileId: '',
        configFileList: [],
        configFileShow: false,
        deploymentFileId: '',
        deploymentFileList: [],
        deploymentFileShow: false,
        customFileId: '',
        customFileList: [],
        customFileShow: false,
        upgradeSqlFileId: '',
        upgradeSqlFileList: [],
        upgradeSqlFileShow: false,
        priceList: [],
      });
    }
    if (next.returnType === 'updateApplication' && next.resultCode === 1000) {
      this.setState({
        configFileId: '',
        configFileList: [],
        configFileShow: false,
        deploymentFileId: '',
        deploymentFileList: [],
        deploymentFileShow: false,
        customFileId: '',
        customFileList: [],
        customFileShow: false,
        upgradeSqlFileId: '',
        upgradeSqlFileList: [],
        upgradeSqlFileShow: false,
        priceList: [],
        priceListCopy: [],
      });
    }
  }

  handleSearch = value => {
    // this.fetch(value, data => this.setState({ data }));
    this.props.dispatch({
      type: 'publish/queryUser',
      payload: {
        mail: value,
        type: 2,
      },
    });
  };
  priceCancel = () => {
    this.setState({
      PriceVisible: false,
      priceList: this.state.priceListCopy,
    });
  };
  priceCreate = dataSource => {
    const form = this.formRef.props.form;
    const reg = /^[A-Za-z0-9]+$/;
    var flag = true;

    // const err = this.formRef.formRef.formObj();
    // if(!!err.validateFields){
    //     err.validateFields((error, values)=>{
    //         if(error){
    //             console.log(error)
    //             return false;
    //         }
    //     })
    // }
    this.setState({
      priceListCopy: this.state.priceList,
    });
      const len = dataSource.length - 1
      for (let v in dataSource[len]) {
        if (v === 'value' && !reg.test(dataSource[len][v])) {
          message.error('值为数字或英文字母！');
          return;
        }
        if (v !== 'key') {
          switch (dataSource[len][v]) {
            case '请输入名称！': {
              message.error('请输入名称、标签或值！');
              flag = false;
              return;
            }
            case '请输入标签！': {
              message.error('请输入名称、标签或值！');
              flag = false;
              return;
            }
            case '请输入值！': {
              message.error('请输入名称、标签或值！');
              flag = false;
              return;
            }
          }
        }
      }
      if (flag) {
        form.validateFields((err, values) => {
          if (err) {
            return;
          } else {
            const list = {};
            const priceList = this.state.priceList;
            list.configJson = dataSource;
            list.price = values.price;
            priceList.push(list);
            // console.log(list)
            // console.log(priceList)
            this.setState({
              priceList: priceList,
              PriceVisible: false,
            });
          }
        });
        flag = false;
      }
    // dataSource.forEach(item => {
    //   for (let v in item) {
    //     if (v === 'value' && !reg.test(item[v])) {
    //       message.error('值为数字或英文字母！');
    //       return;
    //     }
    //     if (v !== 'key') {
    //       switch (item[v]) {
    //         case '请输入名称！': {
    //           message.error('请输入名称、标签或值！');
    //           flag = false;
    //           return;
    //         }
    //         case '请输入标签！': {
    //           message.error('请输入名称、标签或值！');
    //           flag = false;
    //           return;
    //         }
    //         case '请输入值！': {
    //           message.error('请输入名称、标签或值！');
    //           flag = false;
    //           return;
    //         }
    //       }
    //     }
    //   }
    //   if (flag) {
    //     form.validateFields((err, values) => {
    //       if (err) {
    //         return;
    //       } else {
    //         const list = {};
    //         const priceList = this.state.priceList;
    //         list.configJson = dataSource;
    //         list.price = values.price;
    //         priceList.push(list);
    //         // console.log(list)
    //         // console.log(priceList)
    //         this.setState({
    //           priceList: priceList,
    //           PriceVisible: false,
    //         });
    //       }
    //     });
    //     flag = false;
    //   }
    // });

    // const formChild = this.formRef.props.props.form;
    // form.validateFields((err, values) => {
    //     if(err){
    //         alert(111)
    //         return
    //     }else {
    //         const list = {};
    //         const priceList = this.state.priceList;
    //         list.configJson = dataSource;
    //         list.price = values.price;
    //         priceList.push(list);
    //         // console.log(list)
    //         // console.log(priceList)
    //         this.setState({
    //             priceList:priceList,
    //             PriceVisible: false,
    //         });
    //     }
    // })
  };
  changePrice = e => {
    e.preventDefault();
    const _index = e.target.getAttribute('data-index');
    const form = this.formRef.props.form;
    const priceList = this.state.priceList[_index];
    // console.log(index)
    // console.log(priceList)
    var p;
    this.setState({
      priceListCopy: this.state.priceList,
    });
    if (typeof priceList.configJson == 'string') {
      JSON.parse(priceList.configJson);
      p = eval('(' + priceList.configJson + ')');
      // console.log(p)
    } else if (Array.isArray(priceList.configJson) || typeof priceList.configJson === 'object') {
      p = priceList.configJson;
    }
    this.setState({
      priceSource: p,
      PriceVisible: true,
    });
    const pl = [];
    this.state.priceList.forEach((item, index) => {
      if (_index != index) {
        pl.push(item);
      }
      return pl;
    });
    this.setState({
      priceList: pl,
    });
    form.getFieldDecorator('price', { initialValue: priceList.price });
  };
  deletePrice = e => {
    e.preventDefault();
    e.stopPropagation();
    const _index = e.target.getAttribute('data-index');
    const priceList = this.state.priceList;
    const pl = [];
    priceList.forEach((item, index) => {
      if (_index != index) {
        pl.push(item);
      }
      return pl;
    });
    this.setState({
      priceList: pl,
    });
  };
  priceShow = e => {
    // e.preventDefault();
    const form = this.formRef.props.form;
    this.setState({
      priceListCopy: this.state.priceList,
    });
    form.resetFields();
    this.setState({
      priceSource: [
        {
          key: 0,
          name: '请输入名称！',
          tag: '请输入标签！',
          value: '请输入值！',
        },
      ],
      PriceVisible: true,
    });
  };

  handleChange = value => {};
  configFileChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
    }
    if (value.file.status === 'error') {
      message.error('配置文件上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('配置文件上传失败');
        return false;
      }
      this.setState({
        configFileId: value.file.response.data.fileId,
        configFileShow: true,
      });
    }
    this.setState({
      configFileList: [...value.fileList],
    });
  };
  deploymentFileChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
    }
    if (value.file.status === 'error') {
      message.error('部署文件上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('部署文件上传失败');
        return false;
      }
      this.setState({
        deploymentFileId: value.file.response.data.fileId,
        deploymentFileShow: true,
      });
    }
    this.setState({
      deploymentFileList: [...value.fileList],
    });
  };
  customFileChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
    }
    if (value.file.status === 'error') {
      message.error('租户脚本上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('租户脚本上传失败');
        return false;
      }
      this.setState({
        customFileId: value.file.response.data.fileId,
        customFileShow: true,
      });
    }
    this.setState({
      customFileList: [...value.fileList],
    });
  };
  upgradeSqlFileChange = value => {
    if (value.fileList.length > 1) {
      value.fileList.splice(0, 1);
    }
    if (value.file.status === 'error') {
      message.error('升级脚本上传失败');
      return false;
    }
    if (value.file.response) {
      if (value.file.response.resultCode !== 1000) {
        message.error('升级脚本上传失败');
        return false;
      }
      this.setState({
        upgradeSqlFileId: value.file.response.data.fileId,
        upgradeSqlFileShow: true,
      });
    }
    this.setState({
      upgradeSqlFileList: [...value.fileList],
    });
  };

  fileBeforeUpload = file => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //     message.error('You can only upload JPG file!');
    // }
    const isLt200M = file.size / 1024 / 1024 < 200;
    if (!isLt200M) {
      message.error('文件上传不能超过200M!');
      return false;
    }
  };
  configFileRemove = file => {
    this.setState({
      configFileId: '',
    });
    setTimeout(() => {
      this.props.form.setFields({
        configFileId: {
          value: '',
          errors: [new Error('请上传配置文件！')],
        },
      });
    }, 500);
  };
  deploymentFileRemove = file => {
    this.setState({
      deploymentFileId: '',
    });
    setTimeout(() => {
      this.props.form.setFields({
        deploymentFileId: {
          value: '',
          errors: [new Error('请上传部署文件！')],
        },
      });
    }, 500);
  };
  customFileRemove = file => {
    this.setState({
      customFileId: '',
    });
    setTimeout(() => {
      this.props.form.setFields({
        customFileId: {
          value: '',
          errors: [new Error('请上传租户脚本文件！')],
        },
      });
    }, 500);
  };
  upgradeSqlFileRemove = file => {
    this.setState({
      upgradeSqlFileId: '',
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  fileUploadBtn = file => {
    this.setState({
      [file]: true,
    });
  };
  render() {
    const { visible, onCancel, onCreate, form, btnTag } = this.props;
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
      // console.log(item)
      const key = item.userId;
      const val = item.userMail;
      optionDoms.push(<Option key={key}>{val}</Option>);
      // console.log(optionDoms)
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
    const configFile = {
      // accept: '.yml',
      accept: '.yml',
      action: '/api/saas-server/file/upload',
      name: 'file',
      listType: 'text',
      beforeUpload: this.fileBeforeUpload,
      showUploadList: this.state.configFileShow,
      onChange: this.configFileChange,
      onRemove: this.configFileRemove,
      fileList: [...this.state.configFileList],
    };
    const deploymentFile = {
      accept: '.zip',
      action: '/api/saas-server/file/upload',
      name: 'file',
      listType: 'text',
      beforeUpload: this.fileBeforeUpload,
      showUploadList: this.state.deploymentFileShow,
      onChange: this.deploymentFileChange,
      onRemove: this.deploymentFileRemove,
      fileList: [...this.state.deploymentFileList],
    };
    const customFile = {
      accept: '.zip',
      action: '/api/saas-server/file/upload',
      name: 'file',
      listType: 'text',
      beforeUpload: this.fileBeforeUpload,
      showUploadList: this.state.customFileShow,
      onChange: this.customFileChange,
      onRemove: this.customFileRemove,
      fileList: [...this.state.customFileList],
    };
    const upgradeSqlFile = {
      accept: '.zip',
      action: '/api/saas-server/file/upload',
      name: 'file',
      listType: 'text',
      beforeUpload: this.fileBeforeUpload,
      showUploadList: this.state.upgradeSqlFileShow,
      onChange: this.upgradeSqlFileChange,
      onRemove: this.upgradeSqlFileRemove,
      fileList: [...this.state.upgradeSqlFileList],
    };
    const priceList = [];
    // console.log(this.state.priceList)
    // const p = JSON.parse(this.state.priceList[0].configJson);
    // console.log(p[0].name)
    this.state.priceList.forEach((item, index) => {
      var p;
      // const p = JSON.parse(item.configJson);
      if (typeof item.configJson == 'string') {
        JSON.parse(item.configJson);
        p = eval('(' + item.configJson + ')');
        // console.log(p)
      } else if (Array.isArray(item.configJson) || typeof item.configJson === 'object') {
        p = item.configJson;
      }
      const mapList = [];
      const _index = index;
      if (!!p) {
        // console.log(p)
        p.map((list, index) => {
          // console.log(index)
          if (index === 1) {
            mapList.push(
              <p data-index={_index} style={{ textAlign: 'right', marginRight: '10px' }}>
                ...
              </p>
            );
          } else if (index > 1) {
            mapList.push();
          } else {
            mapList.push(
              <p data-index={_index}>
                <span data-index={_index} className={style.priceName}>
                  {list.name} :
                </span>
                <span data-index={_index}> {list.value}</span>
              </p>
            );
            mapList.push(
              <p data-index={_index}>
                <span data-index={_index} className={style.priceName}>
                  单价:
                </span>
                <span data-index={_index}> {item.price}</span>
              </p>
            );
          }
        });
        priceList.push(
          <li data-index={index} onClick={this.changePrice}>
            {mapList}
            <Icon
              data-index={_index}
              className={style.icon}
              type="close-circle-o"
              onClick={this.deletePrice}
            />
          </li>
        );
      }
      return priceList;
    });

    return (
      <Modal
        visible={visible}
        title={btnTag === '新增' ? '新建版本' : '修改版本'}
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate.bind(this, [
          this.state.configFileId,
          this.state.deploymentFileId,
          this.state.customFileId,
          this.state.upgradeSqlFileId,
          this.state.priceList,
        ])}
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appName', {
              initialValue: this.props.appName,
            })(<Input disabled />)}
            {getFieldDecorator('appId', {
              initialValue: this.props.appId,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="版本名称">
            {getFieldDecorator('versionName', {
              rules: [
                {
                  required: true,
                  message: '请输入版本名称！',
                },
              ],
            })(<Input placeholder="请输入版本名称！" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员邮箱：">
            {getFieldDecorator('adminId', {
              rules: [
                {
                  required: true,
                  message: '请输入管理员邮箱！',
                },
                {
                  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                  message: '邮箱格式错误！',
                },
              ],
            })(
              <Select
                showSearch
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
              >
                {optionDoms}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="租户个数">
            {getFieldDecorator('limitTotal', {
              rules: [
                {
                  required: true,
                  message: '请输入租户个数！',
                },
              ],
            })(<InputNumber placeholder="请输入租户个数！" style={{ width: '100%' }} min="1" max='9999999999' />)}
          </FormItem>
          <FormItem {...formItemLayout} label="配置文件">
            {getFieldDecorator('configFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传配置文件！',
                },
              ],
            })(
              <Upload {...configFile}>
                <Button onClick={this.fileUploadBtn.bind(this, 'configFileShow')}>
                  <Icon type="upload" /> 上传配置文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="部署文件">
            {getFieldDecorator('deploymentFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传部署文件！',
                },
              ],
            })(
              <Upload {...deploymentFile}>
                <Button onClick={this.fileUploadBtn.bind(this, 'deploymentFileShow')}>
                  <Icon type="upload" /> 上传部署文件
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="租户脚本">
            {getFieldDecorator('customFileId', {
              rules: [
                {
                  required: true,
                  message: '请上传租户脚本文件！',
                },
              ],
            })(
              <Upload {...customFile}>
                <Button onClick={this.fileUploadBtn.bind(this, 'customFileShow')}>
                  <Icon type="upload" /> 上传租户脚本
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="升级脚本">
            {getFieldDecorator('upgradeSqlFileId', {
              // rules: [{
              //     required: true,
              //     message: '请上传升级脚本文件！',
              // }],
            })(
              <Upload {...upgradeSqlFile}>
                <Button onClick={this.fileUploadBtn.bind(this, 'upgradeSqlFileShow')}>
                  <Icon type="upload" /> 上传升级脚本
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="版本描述">
            {getFieldDecorator('versionDesc', {
              rules: [
                {
                  required: true,
                  message: '请输入版本描述！',
                },
                {
                  max: 200,
                  message: '版本描述长度小于200个字符！',
                },
              ],
            })(<TextArea placehoder="请输入版本描述" style={{ height: '73px' }} />)}
          </FormItem>
        </Form>

        <Row>
          <Col span={5} style={{ color: 'rgba(0, 0, 0, 0.85)', textAlign: 'right' }}>
            <span
              style={{
                marginRight: '4px',
                fontFamily: 'SimSun',
                lineHeight: 1,
                fontSize: '14px',
                color: '#f5222d',
              }}
            >
              *
            </span>价格信息：
          </Col>
          <Col span={19}>
            <ul id="priceList" className={style.priceList}>
              {priceList}
              <li onClick={this.priceShow}>+</li>
            </ul>
          </Col>
        </Row>
        <ApplicationPrice
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.PriceVisible}
          priceSource={this.state.priceSource}
          onCancel={this.priceCancel}
          onCreate={this.priceCreate}
        />
      </Modal>
    );
  }
}

import { Button, Modal, Form, Input, Select, Row, Col, Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import styles from './Manage.less';
@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/submit'],
}))
@Form.create()
export default class UpdateUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickTag: false,
      departmentIdsArr: [],
      selectId: false,
    };
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    // this.setState({ clickTag: false });
    if (nextProps.selectId !== this.props.selectId) {
      this.setState({ selectId: nextProps.selectId });
    }
    if (nextProps.clickTag !== this.props.clickTag) {
      this.setState({ clickTag: nextProps.clickTag });
    }
    const next = nextProps.manage;
    if (next.resultCode == 2004 && next.returnType === 'checkPhoneUpdata') {
      setTimeout(() => {
        this.props.form.setFields({
          editUserPhone: {
            value: '',
            errors: [new Error('手机号重复！')],
          },
        });
      }, 500);
    }
    next.returnType = '';
  }
  displayRender = label => {
    return label[label.length - 1];
  };
  onChange = value => {
    //级联select下拉选择事件
    this.setState({
      departmentIdsArr: value,
      selectId: true,
    });
    const leafId = value[value.length - 1];
    this.props.leafIdOfUpdate(leafId, this.state.clickTag, true);
  };
  handleChange = value => {
    // 触发单位Id下拉事件
    this.setState({
      clickTag: true,
      selectId: false,
    });
    this.props.leafIdOfUpdate('', true, false);
    if (!!value.key) {
      this.props.dispatch({
        type: 'manage/getTree',
        payload: {
          companyId: value.key,
        },
      });
    } else {
      this.props.setTreeDataBlank();
    }
  };
  checkPhone = () => {
    this.props.form.validateFields(
      ['editUserPhone', 'editUserId'],
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'manage/checkPhoneUpdata',
            payload: {
              userId: values.editUserId,
              phone: values.editUserPhone,
            },
          });
        }
      }
    );
  };

  render() {
    const { visible, onCancel, onCreate, form, defaultdatas, companyIdList, treeData } = this.props;
    var findChild = (child, arr) => {
      let array = [];
      let flag = false;
      const deep = (child, arr, parentArr = []) => {
        if (!arr) {
          return;
        }
        arr.forEach(obj => {
          if (!obj) {
            return;
          }
          if (obj.value === child) {
            flag = true;
            array = [...parentArr, obj.value];
          }
        });
        if (!flag) {
          arr.forEach(obj => {
            const parentArr2 = [...parentArr, obj.value];
            deep(child, obj.children, parentArr2);
          });
        } else {
          return;
        }
      };

      deep(child, arr);
      if (flag) {
        return array;
      }
    };

    var departmentIdArr = [];
    if (!!defaultdatas.departmentId) {
      departmentIdArr = findChild(defaultdatas.departmentId, treeData);
    }
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };

    return (
      <Modal
        visible={visible}
        title="修改用户信息"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('editUserName', {
              initialValue: defaultdatas.userName,
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
                {
                  pattern: /^.{0,40}$/,
                  message: '用户名不能超过40个字符！',
                },
              ],
            })(<Input placeholder="用户名" />)}
          </FormItem>
          <FormItem style={{ display: 'none' }} {...formItemLayout} label="用户Id">
            {getFieldDecorator('editUserId', {
              initialValue: defaultdatas.userId,
            })(<Input placeholder="用户Id" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('editUserPhone', {
              initialValue: defaultdatas.userPhone,
              rules: [
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ],
            })(<Input placeholder="手机号" onBlur={this.checkPhone} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户类型">
            {getFieldDecorator('editUserType', {
              initialValue: { key: `${defaultdatas.userType}` },
              rules: [
                {
                  required: true,
                  message: '请输入用户类型！',
                },
              ],
            })(
              <Select placeholder="请选择" labelInValue>
                <Option value="1">SAAS管理员</Option>
                <Option value="2">服务提供方</Option>
                <Option value="3">服务购买方</Option>
                <Option value="4">业务用户</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="单位名称">
            {getFieldDecorator('editCompanyId', {
              initialValue: !!defaultdatas.companyId
                ? { key: `${defaultdatas.companyId}` }
                : { key: '' },
            })(
              <Select
                placeholder="请选择"
                style={{ width: '135' }}
                labelInValue
                onChange={this.handleChange}
              >
                <Option value="">请选择</Option>
                {companyIdList}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属部门">
            <Cascader
              value={
                !!this.state.selectId
                  ? this.state.departmentIdsArr
                  : !!this.state.clickTag ? [] : departmentIdArr
              }
              options={this.props.treeData}
              onChange={this.onChange}
              displayRender={this.displayRender}
              placeholder="请选择"
              changeOnSelect
              allowClear={false}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="用户状态">
            {getFieldDecorator('editState', {
              initialValue: { key: `${defaultdatas.state}` },
              rules: [
                {
                  required: true,
                  message: '请输入用户状态！',
                },
              ],
            })(
              <Select placeholder="请选择" labelInValue>
                <Option value="1">正常</Option>
                <Option value="2">用户锁定</Option>
                <Option value="3">用户注销</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

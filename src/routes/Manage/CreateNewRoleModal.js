import { Button, Modal, Form, Input, Select, Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import styles from './Manage.less';
import { connect } from 'dva';
@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/searchRole'],
}))
@Form.create()
export default class CreateNewRoleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
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
        title="新增角色信息"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem {...formItemLayout} label="角色名称">
            {getFieldDecorator('roleName', {
              rules: [
                {
                  required: true,
                  message: '请输入角色名称！',
                },
                {
                  pattern: /^.{0,20}$/,
                  message: '角色名称不能超过20个字符！',
                },
              ],
            })(<Input placeholder="角色名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="角色类型">
            {getFieldDecorator('roleType', {
              rules: [
                {
                  required: true,
                  message: '请输入角色类型！',
                },
              ],
            })(
              <Select placeholder="请选择">
                <Option value="1">管理员</Option>
                <Option value="2">发布者</Option>
                <Option value="3">租户</Option>
                <Option value="4">业务</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

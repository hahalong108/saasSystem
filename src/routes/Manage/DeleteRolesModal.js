import { Button, Modal, Form, Input, Select, Cascader, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import styles from './Manage.less';
import { connect } from 'dva';
@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/searchRole'],
}))
@Form.create()
export default class DeleteRolesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="删除角色"
        okText="确定"
        onCancel={onCancel}
        onOk={onCreate}
        width={400}
      >
        <Form>
          <FormItem>
            <p style={{ margin: '0 auto 20px', textAlign: 'center' }}>是否删除已选角色？</p>
          </FormItem>
          <FormItem>
            {getFieldDecorator('isMandatory', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>
                是否强制删除
                <p style={{ fontSize: '12px', lineHeight: '24px' }}>
                  （如果你选择“强制删除”,已经分配给用户的角色也将被删除，用户将失去相应的功能权限！）
                </p>
              </Checkbox>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

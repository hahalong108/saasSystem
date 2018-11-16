import { Modal, Form, Checkbox, Row, Col } from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
import { connect } from 'dva';
import styles from './Manage.less';
@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/submit'],
}))
@Form.create()
export default class SetRoleForUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  onChange = checkedValues => {};
  render() {
    const { visible, onCancel, onCreate, form, defaultdatas, rolesList } = this.props;
    let currentRole = [];
    for (var i = 0; i < rolesList.length; i++) {
      currentRole.push(rolesList[i].roleId);
    }
    const { getFieldDecorator } = form;
    const roleList = defaultdatas.map((data, index) => (
      <Col span={8} key={index} className={styles.setCol8}>
        <Checkbox value={data.roleId}>{data.roleName}</Checkbox>
      </Col>
    ));
    return (
      <Modal visible={visible} title="分配角色" okText="保存" onCancel={onCancel} onOk={onCreate}>
        <Form>
          <FormItem>
            {getFieldDecorator('roleIds', {
              initialValue: currentRole,
              rules: [
                {
                  required: true,
                  message: '至少选择一个角色！',
                },
              ],
            })(
              <CheckboxGroup onChange={this.onChange}>
                <Row>{roleList}</Row>
              </CheckboxGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

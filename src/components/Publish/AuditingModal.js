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
import style from './Publish.less';
import '../../common.less';

@connect(({ publish, loading }) => ({
  publish,
  //submitting: loading.effects['publish/applicationPageDetails'],
}))
@Form.create()
export default class AuditingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const next = nextProps.publish;
    if (next.returnType === 'queryUser' && next.resultCode == 1000) {
      this.setState({
        data: next.resultData,
      });
      next.resultCode = 0;
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
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

    return (
      <Modal
        visible={visible}
        title="审核"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
        destroyOnClose
      >
        <Form>
          <FormItem {...formItemLayout} label="审核状态">
            {getFieldDecorator('state', {
              rules: [
                {
                  required: true,
                  message: '请输入审核状态！',
                },
              ],
            })(
              <Select>
                <option value="2">通过</option>
                <option value="3">不通过</option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="审核建议">
            {getFieldDecorator('reviewDesc', {
              rules: [
                {
                  required: true,
                  message: '请输入审核建议！',
                },
                {
                  max: 200,
                  message: '审核建议长度不能超过200个字符!',
                },
              ],
            })(<TextArea placehoder="请输入审核建议" style={{ height: '73px' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

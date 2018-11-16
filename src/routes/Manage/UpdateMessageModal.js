import { Button, Modal, Form, Input, Row, Col } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
import { connect } from 'dva';
import styles from './Manage.less';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
import jqy from 'jquery';
import { readResultConst, messageTypeStatus, severityStatus } from '../../common.js';
import moment from 'moment';

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/searchRole'],
}))
@Form.create()
export default class UpdateMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  getOpinion = e => {
    jqy('#opinion').val(jqy.trim(jqy('#opinion').val()));
    this.props.getOpinion(jqy('#opinion').val());

    const message = jqy.trim(jqy('#opinion').val());
    if (message.length > 300) {
      jqy('#opinionLengthControl').text('意见不能超过300个字符！');
    } else {
      jqy('#opinionLengthControl').text('');
    }
  };
  render() {
    const { visible, onCancel, onCreate, form, defaultdatas } = this.props;
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
      <Modal visible={visible} title="信息详情" okText="保存" onCancel={onCancel} onOk={onCreate}>
        <Form>
          <FormItem {...formItemLayout} label="模块">
            {getFieldDecorator('modelName', {
              initialValue: defaultdatas.modelName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="子模块">
            {getFieldDecorator('subModelName', {
              initialValue: defaultdatas.subModelName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="消息类型">
            {getFieldDecorator('messageType', {
              initialValue: messageTypeStatus[defaultdatas.messageType],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="严重程度">
            {getFieldDecorator('result', {
              initialValue: severityStatus[defaultdatas.severity],
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="创建时间">
            {getFieldDecorator('createTime', {
              initialValue: moment(defaultdatas.createTime).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="信息内容">
            {getFieldDecorator('message', {
              initialValue: defaultdatas.message,
            })(
              // <Input placeholder="信息内容" disabled />
              <TextArea rows={4} disabled />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="意见">
            {getFieldDecorator('opinion', {
              initialValue: defaultdatas.opinion,
            })(<TextArea rows={4} onChange={this.getOpinion} />)}
            <div id="opinionLengthControl" style={{ color: 'red', textAlign: 'left' }} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

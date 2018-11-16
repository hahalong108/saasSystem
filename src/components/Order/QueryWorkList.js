import { Button, Modal, Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import styles from './Order.less';
const { TextArea } = Input;
const Option = Select.Option;
import moment from 'moment';

@connect(({ order, loading }) => ({
  order,
}))
@Form.create()
export default class QueryWorkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) { }
  render() {
    const { visible, onCancel, onCreate, form, workListDetail, applicationlistDatas } = this.props;
    const applicationlist = applicationlistDatas.map((applicationlistData, index) => (
      <Option value={applicationlistData.appId} key={applicationlistData.appId}>
        {applicationlistData.appName}
      </Option>
    ));
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
        title="工单详情"
        okText="确定"
        onOk={onCreate}
        onCancel={onCancel}
        footer={
          <Button onClick={this.props.onCancel} type="primary">
            确定
          </Button>
        }
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appId', {
              initialValue: workListDetail.appName,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="创建时间">
            {getFieldDecorator('createTime', {
              initialValue: moment(workListDetail.createTime).format('YYYY-MM-DD HH:mm:ss'),
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="用户邮箱">
            {getFieldDecorator('mail', {
              initialValue: workListDetail.mail,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: workListDetail.phone,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="工单状态">
            {getFieldDecorator('state', {
              initialValue: { key: `${workListDetail.state}` },
            })(
              <Select disabled labelInValue>
                <Option value="0">完成</Option>
                <Option value="1">未完成</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="问题类型">
            {getFieldDecorator('subjectStr', {
              initialValue: { key: `${workListDetail.subject}` },
            })(
              <Select disabled labelInValue>
                <Option value="1">售前</Option>
                <Option value="2">售后</Option>
                <Option value="3">保修</Option>
                <Option value="4">发票</Option>
                <Option value="5">退款</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="问题描述">
            {getFieldDecorator('message', {
              initialValue: workListDetail.message,
            })(<TextArea disabled rows={8} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

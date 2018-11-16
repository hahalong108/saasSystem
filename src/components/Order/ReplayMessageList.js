import { Button, Modal, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './Order.less';
const { TextArea } = Input;
import NotMineReplay from './NotMineReplay.js';
import MineReplay from './MineReplay.js';
import LeaveMessage from './LeaveMessage.js';
import ReactDOM from 'react-dom';
import jqy from 'jquery';

@connect(({ order, loading }) => ({
  order,
}))
@Form.create()
export default class ReplayMessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    const { visible, onCancel, onCreate, form, queryReplayDetail, workState } = this.props;
    const { getFieldDecorator } = this.props.form;
    const queryReplay = queryReplayDetail.map((queryReplay, index) => {
      if (!queryReplay.isMy) {
        return <NotMineReplay replaydatas={queryReplay} key={queryReplay.replyId} />;
      } else {
        return <MineReplay replaydatas={queryReplay} key={queryReplay.replyId} />;
      }
    });
    return (
      <Modal
        visible={visible}
        title="工单留言"
        okText="确定"
        onCancel={onCancel}
        onOk={onCreate}
        width={600}
        footer={
          workState == 0 ? (
            <Button type="primary" onClick={onCancel}>
              确定
            </Button>
          ) : (
            <LeaveMessage leaveMessage={this.props.onCreate} />
          )
        }
      >
        <Form id="messageListBox">
          <FormItem>{queryReplay}</FormItem>
          {workState == 0 ? null : (
            <FormItem>
              <div id="newMessages" />
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
}

import { Button, Modal, Form, Input, Row, Col, Alert } from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './Order.less';
import jqy from 'jquery';
import { reduce } from 'zrender/lib/core/util';
const { TextArea } = Input;

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/createReply'],
}))
@Form.create()
export default class LeaveMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate() {
    const wait = (func = () => {}, name = '', time = 1000) => {
      if (!func || !name || !time) {
        throw new Error(wait.toString());
      }
      const last = window[name];

      const fun = () => {
        // 隔一段时间后自动释放变量
        setTimeout(() => {
          window[name] = null;
        }, time);
        func();
      };

      if (!last) {
        fun();
      } else {
        const current = new Date().getTime();
        if (current - last - time > 0) {
          fun();
        }
      }
      // 重置
      window[name] = +new Date();
    };

    jqy(document).keypress(
      function(e) {
        var evn = e || window.event;
        var eCode = evn.keyCode ? evn.keyCode : evn.which ? evn.which : evn.charCode;
        if (eCode == 13) {
          wait(this.props.leaveMessage, 'enterMessage', 1000);
        }
      }.bind(this)
    );

    jqy("#submitMessage").click(function(){
      wait(this.props.leaveMessage, 'clikMessage', 1000);
    }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps) {}
  messageDetail = e => {
    jqy('#myMessage').val(jqy.trim(jqy('#myMessage').val()));
    const message = jqy.trim(jqy('#myMessage').val());
    if (message.length > 200) {
      jqy('#lengthControl').text('留言信息不能超过200个字符！');
    } else {
      jqy('#lengthControl').text('');
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const messageTitle = classNames(styles.messageTitle, styles.alignLeft);
    const messageArea = classNames(styles.messageArea);
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };

    // style={{color:"red",textAlign:"left"}}
    return (
      <Form>
        <FormItem className={messageTitle}>留言:</FormItem>
        <textarea id="myMessage" onChange={this.messageDetail} className={messageArea} />
        <div id="lengthControl" style={{ color: 'red', textAlign: 'left' }} />
        <Button type="primary" id="submitMessage" style={{ margin: '20px 0 0' }}>
          提交
        </Button>
      </Form>
    );
  }
}

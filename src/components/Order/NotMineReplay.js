import { Button, Modal, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './Order.less';
const { TextArea } = Input;
import moment from 'moment';

@connect(({ order, loading }) => ({
  order,
}))
@Form.create()
export default class NotMineReplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  render() {
    const { replaydatas } = this.props;
    const messageBox = classNames(styles.messageBox, styles.floatLeft, styles.alignLeft);
    const messageP = classNames(styles.messageP, styles.alignLeft);
    const messageLabel = classNames(
      styles.messageLabel,
      styles.floatLeft,
      styles.alignLeft,
      styles.paddingRight
    );
    const messageTextarea = classNames(styles.messageTextarea, styles.floatLeft);
    const message = classNames(styles.floatLeft);
    return (
      <div className={messageBox}>
        <p className={messageP}>{moment(replaydatas.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        <div className={message}>
          <label className={messageLabel} title={replaydatas.userName}>
            {replaydatas.userName}
          </label>
          <div className={messageTextarea}>{replaydatas.message}</div>
        </div>
      </div>
    );
  }
}

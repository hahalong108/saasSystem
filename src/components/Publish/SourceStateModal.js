import { Upload, message, Button, Icon, Modal, Form, Input, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import { sourceState } from '../../common';
import '../../common.less';

import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import jqy from 'jquery';

@connect(({ publish, loading }) => ({
  publish,
  submitting: loading.effects['publish/applicationPage'],
}))
export default class SourceStateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onCancel, stateData,title } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const list = [];
    for (var key in stateData) {
      list.push(<h4>{key}</h4>);
      stateData[key].forEach(item => {
        list.push(<p>{item}</p>);
      });
    }
    return (
      <Modal
        visible={visible}
        title={`${title}信息`}
        footer={null}
        onCancel={onCancel}
      >
        <div>
          {list}
        </div>
      </Modal>
    );
  }
}

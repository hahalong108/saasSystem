import { Button, Modal, Form, Input, Select, Cascader } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import '../../common.less';

@connect(({ manage, loading }) => ({
  manage,
  submitting: loading.effects['manage/submit'],
}))
@Form.create()
export default class EditSysValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {}
  checkRepeat = (rule, value, callback) => {
    if (this.props.defaultEle == value.key) {
      callback('请重新选择您要更改的配置值！');
    }
    callback();
  };
  render() {
    const { visible, onCancel, onCreate, form, defaultdatas, optionList, defaultEle } = this.props;
    let optionListArr = optionList && optionList.split(',');
    const optionListOption =
      optionListArr &&
      optionListArr.map(optionListItem => (
        <Option value={optionListItem} key={optionListItem}>
          {optionListItem}
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
        title="修改系统配置"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem {...formItemLayout} label="项目名称">
            {getFieldDecorator('sysName', {
              initialValue: defaultdatas.sysName,
            })(<Input placeholder="项目名称" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="项目描述">
            {getFieldDecorator('sysDesc', {
              initialValue: defaultdatas.sysDesc,
            })(<Input placeholder="项目描述" disabled />)}
          </FormItem>

          <FormItem {...formItemLayout} label="配置值">
            {getFieldDecorator('sysValue', {
              initialValue: { key: defaultEle },
              rules: [
                {
                  validator: this.checkRepeat,
                },
              ],
            })(
              <Select placeholder="请选择" labelInValue>
                {optionListOption}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

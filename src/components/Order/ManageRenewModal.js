import { Button, Modal, Form, Input, Select, Row, Col, Radio, InputNumber } from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
import { connect } from 'dva';
import { PayWay } from './PayWay';
import styles from './Order.less';

@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/searchApply'],
}))
@Form.create()
export default class ManageRenewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPayType: 1,
      value: 1,
      unitPrice: 0,
    };
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  getBuyYears = value => {
    this.props.keyOnChange(value);
    // this.setState({
    //   unitPrice:value,
    // });

    this.props.form.setFields({
      totalPrice: {
        value: value * this.props.defaultdatas.unitPrice,
      },
    });
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
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        visible={visible}
        title="续费"
        okText="续费"
        onCancel={onCancel}
        onOk={onCreate}
        footer={
          <div>
            <Button onClick={this.props.onCancel}>取消</Button> <PayWay buyData={defaultdatas} />
          </div>
        }
      >
        <Form>
          <FormItem {...formItemLayout} label="应用名称">
            {getFieldDecorator('appName', {
              initialValue: defaultdatas.appName,
            })(<Input placeholder="应用名称" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="外网域名">
            {getFieldDecorator('userDomainName', {
              initialValue: defaultdatas.userDomainName,
            })(<Input placeholder="外网域名" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="外网IP">
            {getFieldDecorator('outerIp', {
              initialValue: defaultdatas.outerIp,
            })(<Input placeholder="外网IP" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="访问域名">
            {getFieldDecorator('vhDomainName', {
              initialValue: defaultdatas.vhDomainName,
            })(<Input placeholder="访问域名" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="续费时长(年)">
            {getFieldDecorator('buyYears', {
              initialValue: 1,
            })(<InputNumber placeholder="续费时长" onChange={this.getBuyYears} min={1} />)}
            {/* <span style={{marginLeft:"5px"}}>年</span> */}
          </FormItem>
          <FormItem {...formItemLayout} label="单价(元/年)">
            {getFieldDecorator('unitPrice', {
              initialValue: defaultdatas.unitPrice,
            })(<Input placeholder="单价" disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="总价(元)">
            {getFieldDecorator('totalPrice', {
              initialValue: defaultdatas.unitPrice,
            })(<Input placeholder="总价" />)}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="支付方式">
            {getFieldDecorator('payType', {
              initialValue: this.state.defaultPayType,
              rules: [{
                required: true,
                message: '请选择支付方式！',
              },]
            })(
            <RadioGroup onChange={this.onChange}>
                <Radio style={radioStyle} value={1}>支付宝</Radio>
                <Radio style={radioStyle} value={2}>银联</Radio>
                <Radio style={radioStyle} value={3}>线下方式</Radio>
              </RadioGroup>
           )}
          </FormItem> */}
        </Form>
      </Modal>
    );
  }
}

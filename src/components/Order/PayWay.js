import React, { Component } from 'react';
import { Button, Modal, Form, Input, Select, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/payZhifubao'],
}))
@Form.create()
export class PayWay extends React.Component {
  state = {
    value: 1,
  };

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.buyRecord && nextProps.buyRecord[1] === '支付') {
      this.setState({
        value: nextProps.buyRecord[0].payType.toString(),
      });
    }
    if(nextProps.visible === false){
      this.setState({
        value: 1,
      })
    }
    const next = nextProps.order;
  }
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { visible, title, onCancel, onCreate, buyRecord, form } = this.props;
    const { getFieldDecorator } = form;
    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
    };
    return (
      <Modal visible={visible} title={title} okText="确定" onCancel={onCancel} onOk={onCreate} destroyOnClose >
        <Form layout="horizontal">
          <FormItem {...formItemLayout}>
            {getFieldDecorator('payType', {
              initialValue:
                !!buyRecord && buyRecord[1] === '支付' ? buyRecord[0].payType.toString() : null,
            })(
              <RadioGroup
                onChange={this.onChange}
                disabled={!!buyRecord && buyRecord[1] === '支付' ? true : false}
              >
                <Radio style={radioStyle} value="1">
                  支付宝
                </Radio>
                <Radio style={radioStyle} value="2">
                  银联
                </Radio>
                {/*<Radio style={radioStyle} value="3">微信</Radio>*/}
                <Radio value="4">
                  线下合同
                  {this.state.value === '4' ? (
                    <FormItem
                      style={{
                        width: '300px',
                        display: 'inline-block',
                        position: 'absolute',
                        top: '-8px',
                        marginLeft: '10px',
                      }}
                      {...formItemLayout}
                    >
                      {getFieldDecorator('contractNumber', {
                        rules: [
                          {
                            required: true,
                            message: '请输入合同号！',
                          },
                        ],
                      })(<Input />)}
                    </FormItem>
                  ) : null}
                </Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

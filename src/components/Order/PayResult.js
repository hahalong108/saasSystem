import React, { Component } from 'react';
import { Button, Modal, Form, Icon, Select, message, InputNumber, Radio } from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/payZhifubao'],
}))
@Form.create()
export class PayResult extends React.Component {
  state = {};

  render() {
    const { visible, payResultCancel, form } = this.props;

    return (
      <Modal
        visible={visible}
        title="支付完成"
        onCancel={payResultCancel}
        footer={
          <span>
            <Button onClick={this.props.payResultFooterCancel}>失败</Button>
            <Button onClick={this.props.payResultOk}>成功</Button>
          </span>
        }
      >
        <p>
          <Icon
            type="question-circle"
            style={{
              fontSize: '22px',
              color: '#faad14',
              verticalAlign: 'sub',
              marginRight: '10px',
            }}
          />是否支付成功
        </p>
      </Modal>
    );
  }
}

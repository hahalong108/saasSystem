import React, { Component } from 'react';
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  message,
  InputNumber,
  Radio,
  Redirect,
} from 'antd';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import { PayWay } from './PayWay';
import { PayResult } from './PayResult';
import styles from './Order.less';
import moment from 'moment';
const FormItem = Form.Item;
@Form.create()
@connect(({ order, loading }) => ({
  order,
  submitting: loading.effects['order/payZhifubao'],
}))
export class OrderBuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payWayVisible: false,
      unitPrice: 0,
      buyYears: 0,
      payResultVisible: false,
      orderDetId: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!!nextProps.buyData && this.state.unitPrice !== nextProps.buyData.unitPrice) {
      this.setState({
        unitPrice: Number(nextProps.buyData.unitPrice),
        buyYears: Number(nextProps.buyData.buyYears),
      });
    }
    const next = nextProps.order;
    if (next.returnType === 'createRenewal' && next.resultCode === 1000) {
      this.setState(
        {
          payWayVisible: true,
          orderDetId: next.data.detId,
        },
        () => {
          next.resultCode = 0;
        }
      );
    }
    if (next.returnType === 'createXianxia' && next.resultCode === 1000) {
      next.returnType = '';
      message.success("购买成功！");
      if (this.props.buyRecord[1] === '支付') {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/order/manage-order',
          })
        );
      } else if (this.props.buyRecord[1] === '续费' || this.props.buyRecord[1] === '未支付') {
        this.setState({
          payWayVisible: false,
          verifyConstract: false,
        });
        this.props.onCancel();
        this.props.getPage(1);
      }
    }
    if (next.returnType === 'createXianxia' && next.resultCode !== 1000) {
      message.error(next.desc);
    }
    if (next.returnType === 'verifyConstract' && next.resultCode !== 1000) {
      next.returnType = '';
      const form = this.formRef.props.form;
      const contractNumber = form.getFieldValue('contractNumber');
      setTimeout(() => {
        form.setFields({
          contractNumber: {
            value: contractNumber,
            errors: [new Error(next.desc)],
          },
        });
      }, 500);
    }
    if (next.returnType === 'verifyConstract' && next.resultCode === 1000) {
      next.returnType = '';
      const form = this.formRef.props.form;
      form.validateFields((error, values) => {
        values.payType = Number(values.payType);
        values.orderId = this.props.buyData.orderId;
        values.appId = this.props.buyData.appId;
        if (this.props.buyRecord[1] === '续费') {
          values.orderDetId = this.state.orderDetId;
          values.type = "0"
        } else if (this.props.buyRecord[1] === '支付') {
          values.orderDetId = this.props.buyData.orderDetId;
          values.paymentId = this.props.buyRecord[0].paymentId;
          values.type = '1';
        } else if (this.props.buyRecord[1] === '未支付') {
          values.orderDetId = this.props.buyData.orderDetId;
        }
        this.props.dispatch({
          type: 'order/createXianxia',
          payload: {
            ...values,
          },
        });
      });
    }
  }
  showModal = () => {
    const form = this.formRef.props.form;
    form.resetFields();
    if (this.props.buyRecord[1] === '支付' || this.props.buyRecord[1] === '未支付') {
      this.setState({ payWayVisible: true });
    } else if (this.props.buyRecord[1] === '续费') {
      const totalPrice = this.state.unitPrice * this.state.buyYears;
      this.props.dispatch({
        type: 'order/createRenewal',
        payload: {
          appId: this.props.buyData.appId,
          orderDetId: this.props.buyRecord[0].orderDetId,
          orderId: this.props.buyRecord[0].orderId,
          buyYears: this.state.buyYears,
          unitPrice: this.state.unitPrice,
          totalPrice: totalPrice,
        },
      });
    }
  };
  handleCancel = () => {
    this.setState({ payWayVisible: false });
  };
  // payResultOk= () => {
  //     if(this.props.buyRecord[1]==="支付"){
  //         this.props.dispatch(
  //             routerRedux.push({
  //                 pathname: '/order/manage-order',
  //             })
  //         );
  //     }else if(this.props.buyRecord[1]==="续费"){
  //         location.reload();
  //     }
  // };
  // payResultCancel= () => {
  //     this.setState({
  //         payResultVisible:false,
  //     });
  // };
  // payResultFooterCancel= () => {
  //     if(this.props.buyRecord[1]==="支付"){
  //         location.reload();
  //     }else if(this.props.buyRecord[1]==="续费"){
  //         this.props.dispatch(
  //             routerRedux.push({
  //                 pathname: '/order/income-expenses',
  //             })
  //         );
  //     }
  // };
  // 提交
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.payType = Number(values.payType);
      values.orderId = this.props.buyData.orderId;
      values.appId = this.props.buyData.appId;
      if (this.props.buyRecord[1] === '续费') {
        values.orderDetId = this.state.orderDetId;
      } else if (this.props.buyRecord[1] === '支付') {
        values.orderDetId = this.props.buyData.orderDetId;
        values.paymentId = this.props.buyRecord[0].paymentId;
        values.type = '1';
      } else if (this.props.buyRecord[1] === '未支付') {
        values.orderDetId = this.props.buyData.orderDetId;
      }
      if (values.payType === 4) {
        const contractNumber = values.contractNumber;
        this.props.dispatch({
          type: 'order/verifyConstract',
          payload: {
            contractNumber: contractNumber,
          },
        });
        return false;
      }

      fetch('/api/saas/pay/create', {
        method: 'POST',
        // mode: 'same-origin',
        // mode: 'cors',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          return res.text();
        })
        .then(data => {
          setTimeout(function() {
            const tempwindow = window.open('_blank');
            tempwindow.document.write(data);
          }, 500);
          this.setState({
            payWayVisible: false,
            // payResultVisible:true,
          });
          this.props.payResultVisible();
          this.props.onCancel();
        })
        .catch(err => console.log(err));
      form.resetFields();
    });
  };
  yearChange = val => {
    this.setState({
      buyYears: val,
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      visible,
      title,
      buyData,
      buyDataJson,
      buyRecord,
      onCancel,
      onCreate,
      payResultVisible,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    var buyJson;
    if (!!buyDataJson && buyDataJson.length > 0) {
      buyJson = JSON.parse(buyDataJson);
    } else {
      buyJson = [];
    }
    return (
      <Modal
        visible={visible}
        title={title}
        okText="支付"
        onCancel={onCancel}
        payResultVisible={payResultVisible}
        onOk={onCreate}
        footer={
          <div>
            <Button onClick={onCancel}>取消</Button>{' '}
            <Button
              className="collection_btn"
              type="primary"
              style={{ marginLeft: '10px' }}
              onClick={this.showModal}
            >
              支付
            </Button>
          </div>
        }
      >
        <p>
          <span className={styles.spanTitle}>应用名称：</span>
          <span>{buyData.appName}</span>
        </p>
        <p>
          <span className={styles.spanTitle}>访问域名：</span>
          <span>{buyData.vhDomainName}</span>
        </p>
        {/*<p><span className={styles.spanTitle}>购买时长：</span><span>{buyData.buyYears}</span></p>*/}
        {buyRecord[1] === '续费' ? (
          <Form hideRequiredMark>
            <Row style={{ width: '100%' }}>
              <Col>
                <FormItem {...formItemLayout} label="购买时长:">
                  {getFieldDecorator('buyYears', {
                    initialValue: buyData.buyYears,
                  })(<InputNumber min={1} max={10} onChange={this.yearChange} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        ) : (
          <p>
            <span className={styles.spanTitle}>购买时长：</span>
            <span>{buyData.buyYears}</span>
          </p>
        )}

        <p>
          <span className={styles.spanTitle}>到期时间：</span>
          <span>{moment(buyData.expireTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </p>

        {buyJson.map((item, index) => {
          if (item) {
            return (
              <p>
                <span className={styles.spanTitle}>{item.name}：</span>
                <span>{item.value}</span>
              </p>
            );
          }
        })}
        <p>
          <span className={styles.spanTitle}>单价：</span>
          <span>{buyData.unitPrice}</span>
        </p>
        <p>
          <span className={styles.spanTitle}>订单总价：</span>
          <span>{buyData.unitPrice * this.state.buyYears}</span>
        </p>

        <PayWay
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.payWayVisible}
          title="支付方式"
          buyRecord={buyRecord}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        {/*<PayResult*/}
        {/*visible={this.state.payResultVisible}*/}
        {/*payResultCancel={this.payResultCancel}*/}
        {/*payResultOk={this.payResultOk}*/}
        {/*payResultFooterCancel={this.payResultFooterCancel}*/}
        {/*/>*/}
      </Modal>
    );
  }
}

// @connect(({ order, loading }) => ({
//     order,
//     submitting: loading.effects['order/submit'],
// }))
// export class OrderBuy extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             visible: false,
//             buyData: {},
//             buyDataJson: [],
//         };
//     }
//
//     componentWillMount() {
//     }
//
//     componentWillReceiveProps(nextProps) {
//         const next = nextProps.order;
//
//         if (next.returnType === 'selectOrder' && next.resultCode === 1000) {
//             // next.resultCode = 0;
//             this.setState({
//                 buyData: next.data,
//                 buyDataJson: [JSON.parse(next.data.customizedJson)],
//             });
//         }
//     }
//
//     showModal = () => {
//         this.setState({ visible: true });
//         this.props.dispatch({
//             type: 'order/selectOrder',
//             payload: {
//                 orderId: this.props.buyRecord[0].orderId,
//                 orderDetId: this.props.buyRecord[0].orderDetId,
//             },
//         });
//
//     };
//
//     handleCancel = () => {
//         this.setState({ visible: false });
//         this.setState({
//             buyData: "",
//             buyDataJson: [],
//         });
//     };
//
//
//     // 提交
//     // handleCreate = () => {
//     //     this.setState({ visible: false });
//     //     const form = this.formRef.props.form;
//     //     alert(11)
//     //     form.validateFields((err, values) => {
//     //         if (err) {
//     //             return;
//     //         } else {
//     //             console.log(values)
//     //             this.props.dispatch({
//     //                 type: 'order/createRenewal',
//     //                 payload: {
//     //                     orderId: this.props.buyRecord.orderId,
//     //                     orderDetId: this.props.buyRecord.orderDetId,
//     //                 },
//     //             });
//     //         }
//     //     });
//     //
//     // };
//     saveFormRef = (formRef) => {
//         this.formRef = formRef;
//     };
//
//     render() {
//         return (
//             <div style={{ display: 'inline-block' }}>
//                 <Button className={this.props.buyRecord[1]==="续费" ? styles.buy_btn :""}size="small" type="primary"
//                         // disabled={this.props.buyRecord.state === 1 ? false : true}
//                         style={{ marginLeft: '10px' }} onClick={this.showModal}>{this.props.buyRecord[1]}</Button>
//                 <Collection
//                     wrappedComponentRef={this.saveFormRef}
//                     visible={this.state.visible}
//                     buyData={this.state.buyData}
//                     buyDataJson={this.state.buyDataJson}
//                     buyRecord={this.props.buyRecord}
//                     orderId={this.props.buyRecord.orderId}
//                     orderDetId={this.props.buyRecord.orderDetId}
//                     title="订单支付"
//                     onCancel={this.handleCancel}
//                     onCreate={this.handleCreate}
//                 />
//             </div>
//         );
//     }
// }

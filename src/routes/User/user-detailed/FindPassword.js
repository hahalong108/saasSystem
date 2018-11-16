import React, { Component } from 'react';
import { Tabs, Form, Icon, Input, Button, Row, Col, message, Alert } from 'antd';
import styles from './FindPassword.less';
import logo from '../../../assets/img/logo.svg';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import classnames from 'classnames';
import '../../../common.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(({ find, loading }) => ({
  find,
  submitting: loading.effects['find/sendMail'],
}))
@Form.create()
export default class FindPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      code: '',
      random: Math.random() * 100,
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillMount() {}
  componentDidMount() {
    this.props.dispatch({
      type: 'find/getCode',
    });
  }
  componentWillReceiveProps(nextProps) {
    const next = nextProps.find;
    if (next.resultCode == 1000 && next.returnType == 'generateCode') {
      this.setState({
        code: next.data,
      });
    }
    if (next.resultCode == 2001 && next.returnType == 'checkEmailCode') {
      next.resultCode = 0;
      this.props.form.setFields({
        emailCode: {
          errors: [new Error('邮箱验证码错误！')],
        },
      });
    }
    if (next.resultCode == 2014 && next.returnType == 'sendEmail') {
      next.resultCode = 0;
      this.props.form.setFields({
        email: {
          errors: [new Error('该邮箱未注册！')],
        },
      });
    }
    if (next.resultCode == 2006 && next.returnType == 'verifyPhoneCode') {
      next.resultCode = 0;
      setTimeout(() => {
        this.props.form.setFields({
          phoneCode: {
            errors: [new Error('手机验证码错误！')],
          },
        });
      }, 500);
    }
    if (next.resultCode == 1000 && next.returnType == 'sendEmail') {
      message.success('邮件发送成功！', 5);
      this.props.dispatch(routerRedux.push('/user/login'));
    }

    next.returnType = '';
  }

  onGetCaptcha = () => {
    this.props.form.validateFields('userPhone', { force: true }, (err, values) => {
      function encrypt(word, code) {
        var key = CryptoJS.enc.Utf8.parse(code);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
      }
      const stateResult = this.state.code + this.state.code + this.state.code + this.state.code;
      const phone = encrypt(values.userPhone, stateResult);
      values.codeType = 1;
      if (!err) {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
        this.props.dispatch({
          type: 'find/getCaptcha',
          payload: {
            codeType: '3',
            userPhone: phone,
            key: stateResult,
          },
        });
      }
    });
  };

  checkCaptcha = (rule, value) => {
    this.props.form.validateFields(['userPhone', 'phoneCode'], { force: true }, (err, values) => {
      function encrypt(word, code) {
        var key = CryptoJS.enc.Utf8.parse(code);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
      }
      const stateResult = this.state.code + this.state.code + this.state.code + this.state.code;
      const phoneNumber = encrypt(values.userPhone, stateResult);
      if (!err) {
        this.props.dispatch({
          type: 'find/verifyCaptcha',
          payload: {
            userPhone: phoneNumber,
            phoneCode: values.phoneCode,
            codeType: 3,
            key: stateResult,
          },
        });
      }
    });
  };

  handleSubmitWithEmail = e => {
    e.preventDefault();
    this.props.form.validateFields(['email', 'emailCode'], { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'find/sendEmail',
          payload: {
            userMail: values.email,
          },
        });
      }
    });
  };
  freshCode() {
    let ran = Math.random() * 100;
    document.getElementById('freshImg').src = '/api/saas/code/send-img?width=90&height=40&a=' + ran;
  }
  checkEmailCode = (rule, value) => {
    this.props.form.validateFields(['email', 'emailCode'], { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'find/checkEmailCode',
          payload: {
            formCode: values.emailCode,
          },
        });
      }
    });
  };
  handleSubmitWithPhone = e => {
    e.preventDefault();
    this.props.form.validateFields(['userPhone', 'phoneCode'], { force: true }, (err, values) => {
      if (!err) {
        // 手机号加密
        function encrypt(word, code) {
          var key = CryptoJS.enc.Utf8.parse(code);
          var srcs = CryptoJS.enc.Utf8.parse(word);
          var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
          return encrypted.toString();
        }
        const stateResult = this.state.code + this.state.code + this.state.code + this.state.code;
        const phone = encrypt(values.userPhone, stateResult);
        this.props.dispatch(
          routerRedux.push(
            '/user/user-detailed/change-password?userPhone=' +
              phone +
              '&original=' +
              values.phoneCode +
              '&key=' +
              stateResult
          )
        );
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { count } = this.state;
    return (
      <div className={styles.main}>
        <h3 className={styles.tit}>找回密码</h3>
        <Tabs defaultActiveKey="1">
          <TabPane tab="通过邮箱找回" key="1">
            <Form onSubmit={this.handleSubmitWithEmail} className="login-form">
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱！',
                    },
                    {
                      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                      message: '邮箱格式错误！',
                    },
                  ],
                })(<Input size="large" placeholder="邮箱" className={styles.antInputLg} />)}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={18}>
                    {getFieldDecorator('emailCode', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                        {
                          len: 4,
                          message: '请输入四位数验证码！',
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        className={styles.antInputLg}
                        placeholder="验证码"
                        onKeyUp={this.checkEmailCode}
                      />
                    )}
                  </Col>
                  <Col span={6}>
                    <img
                      className={styles.codeSize}
                      src={'/api/saas/code/send-img?width=90&height=40&a=' + `${this.state.random}`}
                      onClick={this.freshCode}
                      id="freshImg"
                    />
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className={styles.antBtnLg}>
                  确定
                </Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="通过手机找回" key="2">
            <Form onSubmit={this.handleSubmitWithPhone} className="login-form">
              <FormItem>
                {getFieldDecorator('userPhone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                })(<Input size="large" placeholder="手机号" className={styles.antInputLg} />)}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('phoneCode', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                        {
                          len: 6,
                          message: '请输入六位数验证码！',
                        },
                      ],
                    })(
                      <Input
                        size="large"
                        placeholder="验证码"
                        className={styles.antInputLg}
                        onKeyUp={this.checkCaptcha}
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      size="large"
                      disabled={count}
                      className={styles.getCaptcha}
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className={styles.antBtnLg}>
                  确定
                </Button>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

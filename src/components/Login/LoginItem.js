import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, message, Input } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import map from './map';
import classNames from 'classnames';
import fetch from 'dva/fetch';
import store from '../../index';

const FormItem = Form.Item;

function encrypt(word, code) {
  var key = CryptoJS.enc.Utf8.parse(code);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
function generator({ defaultProps, defaultRules, type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };
      constructor(props) {
        super(props);
        this.state = {
          count: 0,
          random: Math.random() * 100,
        };
      }
      componentDidMount() {
        if (this.context.updateActive) {
          this.context.updateActive(this.props.name);
        }
        const userMail = localStorage.getItem('loginUserMail');
        const userPassword = localStorage.getItem('loginPassword');

        let userMailText = '';
        let userPasswordText = '';

        if (userMail != undefined) {
          userMailText = userMail;
          userPasswordText = userPassword;
        }
        this.context.form.setFields({
          userMail: {
            value: userMailText,
          },
          password: {
            value: userPasswordText,
          },
        });
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }
      onGetCaptcha = () => {
        let { dispatch } = store;
        let generalCode = localStorage.getItem('generalCode');
        this.context.form.validateFields('userPhone', { force: true }, (err, values) => {
          const codeResult = generalCode + generalCode + generalCode + generalCode;
          const phoneNumber = encrypt(values.userPhone, codeResult);
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

            dispatch({
              type: 'login/getCaptcha',
              payload: {
                codeType: '1',
                userPhone: phoneNumber,
                key: codeResult,
              },
            });
          }
        });
      };

      checkCaptcha = (rule, value) => {
        this.context.form.validateFields(
          ['userPhone', 'phoneCode'],
          { force: true },
          (err, values) => {
            let generalCode = localStorage.getItem('generalCode');
            const codeResult = generalCode + generalCode + generalCode + generalCode;
            const phoneNumber = encrypt(values.userPhone, codeResult);
            if (!err) {
              let { dispatch } = store;
              dispatch({
                type: 'login/verifyCaptcha',
                payload: {
                  userPhone: phoneNumber,
                  phoneCode: values.phoneCode,
                  codeType: 1,
                  key: codeResult,
                },
              });
            }
          }
        );
      };
      freshCode() {
        let ran = Math.random() * 100;
        document.getElementById('freshImg').src =
          '/api/saas/code/send-img?width=90&height=40&a=' + ran;
      }
      onloadImg = () => {
        let { dispatch } = store;
        dispatch({
          type: 'login/getCode',
        });
      };
      checkCode() {
        let { dispatch } = store;
        let imgCode = document.getElementById('formCode').value;
        if (imgCode.length == 4) {
          dispatch({
            type: 'login/verifyCode',
            payload: {
              formCode: imgCode,
            },
          });
        }
      }
      // checkCode = (rule, value) =>{ // 验证图片验证码是否正确
      //   this.context.form.validateFields("formCode",{ force: true },(err,values) => {
      //     if (!err) {
      //       let { dispatch } = store;
      //           dispatch({
      //         type: 'login/verifyCode',
      //         payload: {
      //           ...values,
      //         },
      //       });
      //     }
      //   });
      // }
      render() {
        const { getFieldDecorator } = this.context.form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules, name, ...restProps } = this.props;
        const { count } = this.state;
        const antFormItem = classNames(styles.antFormItem);
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          //手机号验证码
          const inputProps = omit(otherProps, ['onGetCaptcha']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('phoneCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号验证码!',
                      },
                      {
                        len: 6,
                        message: '请输入六位数验证码!',
                      },
                    ],
                  })(<Input size="large" className={styles.antInputLg} placeholder="验证码" />)}
                  {/* onKeyUp={this.checkCaptcha}  */}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    size="large"
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '发送验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          );
        }
        if (type === 'Code') {
          //图片验证码
          // const inputProps = omit(otherProps);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('formCode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码!',
                      },
                      {
                        len: 4,
                        message: '请输入四位数验证码!',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      className={styles.antInputLg}
                      placeholder="验证码"
                      onKeyUp={this.checkCode}
                    />
                  )}
                </Col>
                <Col span={8}>
                  <img
                    className={styles.codeSize}
                    src={'/api/saas/code/send-img?width=90&height=40&a=' + `${this.state.random}`}
                    onClick={this.freshCode}
                    id="freshImg"
                  />
                </Col>
              </Row>
            </FormItem>
          );
        }
        return (
          <FormItem className={antFormItem}>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach(item => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;

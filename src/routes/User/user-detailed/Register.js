import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, message, Popover, Progress } from 'antd';
import { instanceOf } from 'prop-types';
import '../../../common.less';
// import { withCookies, Cookies } from 'react-cookie';
// import logo from '../../../assets/img/logo.svg'
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    statusNum: 0,
    pwd: '',
    dataImg: '',
    errNum: '',
    timeFlag: '',
  };
  // 挂载之前调用
  componentWillMount() {
    this.props.dispatch({
      type: 'register/getInit',
    });
  }

  componentWillReceiveProps(nextProps) {
    const account = this.props.form.getFieldValue('mail');
    const next = nextProps.register;
    if (next.returnType === 'getInit') {
      switch (next.data['2']) {
        case '低': {
          this.setState({
            statusNum: 2,
          });
          break;
        }
        case '中': {
          this.setState({
            statusNum: 1,
          });
          break;
        }
        case '高': {
          this.setState({
            statusNum: 0,
          });
          break;
        }
      }
    }
    if (next.resultCode === 1000 && next.returnType === 'generateCode') {
      this.setState({
        pwd: next.data,
      });
    }

    // 手机验证码错误
    if (next.resultCode === 2006) {
      next.resultCode = 0;
      setTimeout(() => {
        this.props.form.setFields({
          phoneCode: {
            value: '',
            errors: [new Error('手机验证码错误')],
          },
        });
      }, 500);
    }
    // 图片验证码错误
    if (next.resultCode === 2001) {
      next.resultCode = 0;
      const time = new Date();
      const timeFlag = time.getTime();
      this.setState({
        timeFlag: timeFlag,
      });
      setTimeout(() => {
        this.props.form.setFields({
          formCode: {
            value: '',
            errors: [new Error('图片验证码错误')],
          },
        });
      }, 500);
    }
    if (next.resultCode === 2003) {
      next.resultCode = 0;
      setTimeout(() => {
        this.props.form.setFields({
          comfirm: {
            value: '',
            errors: [new Error('注册两次密码不一致')],
          },
        });
      }, 500);
    }
    // if (next.resultCode === '2004') {
    //   setTimeout(() => {
    //     this.props.form.setFields({
    //       userName: {
    //         value: "",
    //         errors: [new Error('用户名已存在')],
    //       },
    //     });
    //   }, 500);
    // }
    if (next.resultCode === 2005) {
      next.resultCode = 0;
      setTimeout(() => {
        this.props.form.setFields({
          userMail: {
            value: '',
            errors: [new Error('邮箱已注册')],
          },
        });
      }, 500);
    }

    if (next.resultCode === 1000 && next.returnType === 'submit') {
      message.success('注册成功！');
      this.props.dispatch(
        routerRedux.push({
          pathname: '/user/login',
          // state: {
          //   account,
          // },
        })
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    this.props.form.validateFields('userPhone', { force: true }, (err, values) => {
      const stateResult = this.state.pwd + this.state.pwd + this.state.pwd + this.state.pwd;
      // console.log(stateResult);
      const phone = encrypt(values.userPhone, stateResult);
      if (!err) {
        // Cookies.set('name', 'value');
        this.props.dispatch({
          type: 'register/captcha',
          payload: {
            codeType: '2',
            userPhone: phone,
          },
        });

        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      }
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 12) {
      return 'ok';
    }
    if (value && value.length > 7) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        // 加密
        const stateResult = this.state.pwd + this.state.pwd + this.state.pwd + this.state.pwd;
        const pwd = encrypt(values.password, stateResult);
        const cfm = encrypt(values.confirm, stateResult);
        values.password = pwd;
        values.confirm = cfm;
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            prefix: this.state.prefix,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const reg = [
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,20}$/,
      /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~!@#$%^&*]{8,20}$/,
      /^.{8,20}$/,
    ];
    const helpResult = [
      '密码必须含有字母数字特殊字符，长度在8-20个字符',
      '密码必须含有字母和数字，长度在8-20个字符',
      '密码长度在8-20个字符',
    ];
    const num = this.state.statusNum;
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (reg[num].test(value) === false) {
        this.setState({
          help: helpResult[num],
        });
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };
  checkCaptcha = (rule, value) => {
    this.props.form.validateFields(['userPhone', 'phoneCode'], { force: true }, (err, values) => {
      const stateResult = this.state.pwd + this.state.pwd + this.state.pwd + this.state.pwd;
      const phone = encrypt(values.userPhone, stateResult);
      const code = values.phoneCode;
      if (!err) {
        this.props.dispatch({
          type: 'register/checkCaptcha',
          payload: {
            codeType: '2',
            userPhone: phone,
            phoneCode: code,
          },
        });
      }
    });
  };

  changeImg = value => {
    const time = new Date();
    const timeFlag = time.getTime();
    this.setState({
      timeFlag: timeFlag,
    });
    // document.getElementById("imgCode").src= '/api/saas/code/send-img?width=90&height=45&time='+ timeFlag;
  };
  onloadImg = () => {
    this.props.dispatch({
      type: 'register/generateCode',
    });
  };
  checkGenerateImg = (rule, value) => {
    this.props.form.validateFields('formCode', { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/checkGenerateImg',
          payload: {
            ...values,
          },
        });
      }
    });
  };
  checkUser = rule => {
    this.props.form.validateFields(rule.target.id, { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/checkUser',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix } = this.state;
    const cueResult = [
      '密码必须含有字母数字特殊字符，长度在8-20个字符',
      '密码必须含有字母和数字，长度在8-20个字符',
      '密码长度在8-20个字符',
    ];
    const num = this.state.statusNum;
    return (
      <div className={styles.main}>
        <h3>欢迎注册望海SAAS应用平台</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
                {
                  pattern: /^.{0,40}$/,
                  message: '用户名不能超过40个字符！',
                },
              ],
            })(<Input size="large" placeholder="用户名" />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>{cueResult[num]}</div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="密码" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('userMail', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱！',
                },
                {
                  pattern: /^.{0,50}$/,
                  message: '邮箱不能超过50个字符！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<Input size="large" placeholder="邮箱" onBlur={this.checkUser} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('formCode', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
                {
                  pattern: /^.{4,4}$/,
                  message: '图片验证码错误！',
                },
              ],
            })(
              <Input
                size="large"
                style={{ width: '70%' }}
                placeholder="验证码"
                onKeyUp={this.checkGenerateImg}
              />
            )}
            <img
              id="imgCode"
              alt="验证码"
              className={styles.code}
              src={`/api/saas/code/send-img?width=90&height=45&time=${this.state.timeFlag}`}
              onLoad={this.onloadImg}
              onClick={this.changeImg}
            />
          </FormItem>
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
            })(<Input size="large" placeholder="手机号" />)}
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
                      pattern: /^.{6,6}$/,
                      message: '手机验证码错误！',
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder="验证码"
                    style={{ width: '96% ' }}
                    onKeyUp={this.checkCaptcha}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  style={{}}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
          </FormItem>
          <FormItem>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
            <button className={styles.reset} onClick={this.handleReset}>
              重置
            </button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
function encrypt(word, state) {
  const key = CryptoJS.enc.Utf8.parse(state);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

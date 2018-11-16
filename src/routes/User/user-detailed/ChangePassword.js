import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Popover, Progress, message } from 'antd';
import { instanceOf } from 'prop-types';
import '../../../common.less';
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

@connect(({ register, user, loading }) => ({
  register,
  currentUser: user.currentUser,
  currentCount: user.currentCount,
  submitting: loading.effects['register/changePassword'],
}))
@Form.create()
export default class ChangePassword extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    statusNum: 0,
    pwd: '',
  };
  // 挂载之前调用
  componentWillMount() {
    this.props.dispatch({
      type: 'register/getInit',
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentDidMount() {
    if (!GetQueryString('userPhone')) {
      this.props.dispatch({
        type: 'register/generateCode',
      });
    }
    if (GetQueryString('userPhone')) {
      this.setState({
        pwd: GetQueryString('key'),
      });
    }
  }
  componentWillReceiveProps(nextProps) {
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
    if (next.resultCode === 1000 && next.returnType === 'changePassword') {
      next.returnType = '';
      message.success('修改密码成功！');
      this.props.dispatch(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    }
    if (next.resultCode !== 1000 && next.returnType === 'changePassword') {
      next.returnType = '';
      message.error(next.desc);
    }

    if (next.resultCode === '2003') {
      setTimeout(() => {
        this.props.form.setFields({
          confirm: {
            value: '',
            errors: [new Error('两次密码不一致')],
          },
        });
      }, 500);
    }

    if (next.resultCode === '1000' && next.returnType === 'submit') {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    }
  }

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
    // console.log(this.state.pwd)
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        // 加密
        let stateResult = '';
        if (this.state.pwd.length === 4) {
          stateResult = this.state.pwd.repeat(4);
        } else {
          stateResult = this.state.pwd;
        }
        // const stateResult = this.state.pwd.repeat(4);
        const pwd = encrypt(values.password, stateResult);
        const cfm = encrypt(values.confirm, stateResult);
        if (!!values.original) {
          values.original = encrypt(values.original, stateResult);
        }
        values.type = '1';
        if (!!GetQueryString('userMail')) {
          values.userMail = GetQueryString('userMail');
          values.original = GetQueryString('original');
          values.type = '2';
        }
        if (!!GetQueryString('userPhone')) {
          values.userPhone = GetQueryString('userPhone');
          values.original = GetQueryString('original');
          values.type = '3';
        }
        values.password = pwd;
        values.confirm = cfm;
        this.props.dispatch({
          type: 'register/changePassword',
          payload: {
            ...values,
          },
        });
      }
    });
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
    const { form, submitting, currentUser, currentCount } = this.props;
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
        <h3>修改密码</h3>
        <Form onSubmit={this.handleSubmit}>
          {!!currentUser &&
            currentCount === 1000 &&
            !GetQueryString('mail') && (
              <FormItem>
                {getFieldDecorator('userMail', {
                  initialValue: currentUser.userMail,
                })(<Input size="large" placeholder="邮箱" disabled />)}
              </FormItem>
            )}
          {!!GetQueryString('mail') && (
            <FormItem>
              {getFieldDecorator('userMail', {
                initialValue: GetQueryString('mail'),
              })(<Input size="large" placeholder="邮箱" disabled />)}
            </FormItem>
          )}
          {!GetQueryString('original') && (
            <FormItem>
              {getFieldDecorator('original', {
                rules: [
                  {
                    required: true,
                    message: '请输入原始密码！',
                  },
                ],
              })(<Input size="large" type="password" placeholder="原始密码" />)}
            </FormItem>
          )}
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
          <FormItem style={{ marginBottom: 0 }}>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              修改
            </Button>
          </FormItem>
          <FormItem>
            {/*<Link className={styles.login} to="/user/login">*/}
            {/*使用已有账户登录*/}
            {/*</Link>*/}
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
function GetQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

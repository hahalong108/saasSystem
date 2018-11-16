import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import store from '../../index';
import jqy from 'jquery';

const { Tab, UserName, Code, Password, Mobile, Captcha, Submit } = Login;

function encrypt(word, code) {
  var key = CryptoJS.enc.Utf8.parse(code);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
    // this.context.router;//it works
  }

  state = {
    type: '1',
    rememberMe: true,
    userMail: '',
    code: '',
  };

  onTabChange = type => {
    this.setState({ type });
    if (type == '2') {
      this.props.dispatch({
        type: 'login/getCode',
      });
    }
  };

  changeRememberMe = e => {
    this.setState({
      rememberMe: e.target.checked,
    });
  };

  componentWillMount() {
    this.setState({
      type: '1',
    });
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const next = nextProps.login;
    if (next.resultCode === 1000 && next.returnType == 'generateCode') {
      next.resultCode = 0;
      next.returnType = '';
      this.setState({
        code: next.data,
      });

      const { type } = this.state;
      if (this.state.type == '1') {
        let generateCode = next.data + next.data + next.data + next.data;
        const userMail = jqy('#userMail').val();
        const formCode = jqy('#formCode').val();
        const pass = jqy('#password').val();
        const password = encrypt(pass, generateCode);
        this.setState({
          userMail: userMail,
        });

        this.props.dispatch({
          type: 'login/login',
          payload: {
            userMail: jqy.trim(userMail),
            password: password,
            formCode: formCode,
            loginType: type,
            // key: resultCode,
          },
        });
      }
      localStorage.setItem('generalCode', next.data);
    }
    if (next.resultCode === 1000 && next.returnType == 'loginstate') {
      //登录通过
      this.props.dispatch({
        //请求权限渲染控制台菜单
        type: 'login/menuTree',
      });
    }
    if (next.resultCode === 1000 && next.returnType == 'getmenuTree') {
      //请求成功后页面跳转
      localStorage.setItem('menuData', JSON.stringify(next.menuTreeData));
      this.props.dispatch({
        type: 'login/authorityTags',
      });
    }
    next.returnType = '';
  }
  handleSubmit = (err, values) => {
    if (!err) {
      if (this.state.type == '1') {
        this.props.dispatch({
          type: 'login/getCode',
        });
      }
      if (this.state.type == '1' && this.state.rememberMe == true) {
        localStorage.setItem('loginUserMail', values.userMail);
        localStorage.setItem('loginPassword', values.password);
      }
      if (this.state.type == '1' && this.state.rememberMe == false) {
        localStorage.setItem('loginUserMail', '');
        localStorage.setItem('loginPassword', '');
      }
      localStorage.removeItem('token');

      if (this.state.type == '2') {
        const code = this.state.code;
        let phoneCode = code + code + code + code;
        const phoneValue = jqy('#phoneCode').val();
        const phone = jqy('#userPhone').val();
        const userPhone = encrypt(phone, phoneCode);
        this.props.dispatch({
          type: 'login/login',
          payload: {
            userPhone: userPhone,
            phoneCode: phoneValue,
            loginType: this.state.type,
            // key: phoneCode,
          },
        });
      }
    }
  };
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    const inputLarge = classnames(styles.antInputLg);
    const loginLink = classnames(styles.loginLink);
    return (
      <div className={styles.mainBg}>
        <div className={styles.main}>
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit.bind(this)}
          >
            <Tab key="1" tab="邮箱登录">
              {login.resultCode === 2001 && !submitting && this.renderMessage('图片验证码错误！')}
              {login.resultCode === 2007 &&
                submitting &&
                message.warning('使用默认密码登录，请修改！', 3) &&
                this.props.dispatch(
                  routerRedux.push(
                    '/user/user-detailed/change-password?mail=' + `${this.state.userMail}`
                  )
                )}
              {login.resultCode === 2009 && !submitting && this.renderMessage('邮箱/密码错误！')}
              {login.resultCode === 2010 &&
                !submitting &&
                this.renderMessage(`${login.resultDesc}`)}
              {login.resultCode === 2020 && !submitting && this.renderMessage('账号锁定或注销！')}
              <UserName name="userMail" placeholder="邮箱" className={inputLarge} />
              <Password name="password" placeholder="密码" className={inputLarge} />
              <Code name="formCode" placeholder="验证码" className={inputLarge} />
              <div style={{ marginBottom: 24 }}>
                <Checkbox checked={this.state.rememberMe} onChange={this.changeRememberMe}>
                  记住密码
                </Checkbox>
              </div>
            </Tab>
            <Tab key="2" tab="手机号登录">
              {login.resultCode === 2006 && !submitting && this.renderMessage('手机验证码不正确！')}
              {login.resultCode === 2017 && !submitting && this.renderMessage('手机号未注册！')}
              {login.resultCode === 2110 &&
                !submitting &&
                this.renderMessage(`${login.resultDesc}`)}
              {login.resultCode === 2002 &&
                !submitting &&
                this.renderMessage('发送手机验证码时间未到期!')}
              {login.resultCode === 2120 && !submitting && this.renderMessage('账号锁定或注销！')}
              <Mobile name="userPhone" className={inputLarge} />
              <Captcha name="phoneCode" className={inputLarge} />
            </Tab>

            <Submit loading={submitting}>登录</Submit>
            <div>
              <a
                className={loginLink}
                href="/user/user-detailed/find-password"
                style={{ marginLeft: 20 }}
              >
                忘记密码
              </a>
              <a
                className={loginLink}
                href="/user/user-detailed/register"
                style={{ marginLeft: 20 }}
              >
                新用户注册
              </a>
              <a className={loginLink} href="/api/saas/server/apply-authorization-code">
                授权登录
              </a>
            </div>
          </Login>
        </div>
      </div>
    );
  }
}

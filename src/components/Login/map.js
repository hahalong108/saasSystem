import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      // prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '邮箱',
    },
    rules: [
      {
        required: true,
        message: '请输入邮箱!',
      },
      // {
      //   max: 40,
      //   message: '用户名最多不能超过40个字符!',
      // },
      {
        pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+[\s]*$/,
        message: '请输入正确格式的邮箱!',
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      // prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
      // {
      //   max: 40,
      //   min: 8,
      //   message: '请输入8-40位字符密码!',
      // },
      // {
      //   pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,40}$/,
      //   message: '密码必须包含字母、数字或特殊字符!',
      // },
    ],
  },
  Code: {
    component: Input,
    props: {
      size: 'large',
      // prefix: <Icon type="lock" className={styles.prefixIcon} />,
      // type: 'password',
      placeholder: '验证码',
    },
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
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      // prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号!',
      },
      {
        pattern: /^1\d{10}$/,
        message: '请输入正确格式的手机号!',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      // prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
      {
        len: 6,
        message: '请输入六位数验证码!',
      },
    ],
  },
};

export default map;

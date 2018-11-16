import { routerRedux } from 'dva/router';
import {
  generateCode,
  checkGenerateImg,
  verifyLoginCaptcha,
  sendEmailToFind,
  getLoginCaptcha,
} from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'find',
  state: {
    data: '',
    resultCode: '',
    returnType: '',
  },

  effects: {
    *checkEmailCode({ payload }, { call, put }) {
      const response = yield call(checkGenerateImg, payload);
      yield put({
        type: 'checkGenerateImg',
        payload: response,
      });
    },

    *getCode({ payload }, { call, put }) {
      const response = yield call(generateCode, payload);
      yield put({
        type: 'getGenerateCode',
        payload: response,
      });
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getLoginCaptcha, payload);
      yield put({
        type: 'getPhoneCode',
        payload: response,
      });
    },
    *verifyCaptcha({ payload }, { call, put }) {
      const response = yield call(verifyLoginCaptcha, payload);
      yield put({
        type: 'verifyPhoneCode',
        payload: response,
      });
    },
    *sendEmail({ payload }, { call, put }) {
      const response = yield call(sendEmailToFind, payload);
      yield put({
        type: 'sendEmailToFind',
        payload: response,
      });
    },
  },

  reducers: {
    checkGenerateImg(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'checkEmailCode',
      };
    },
    getGenerateCode(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        data: payload.data,
        returnType: 'generateCode',
      };
    },
    getPhoneCode(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    verifyPhoneCode(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'verifyPhoneCode',
      };
    },
    sendEmailToFind(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'sendEmail',
      };
    },
  },
};

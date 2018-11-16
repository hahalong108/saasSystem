import {
  fakeRegister,
  getCaptcha,
  checkCaptcha,
  getInit,
  generateCode,
  checkGenerateImg,
  checkUser,
  changePassword,
} from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {},

  effects: {
    *getInit(_, { call, put }) {
      const response = yield call(getInit);
      yield put({
        type: 'registerInit',
        payload: response,
      });
    },
    *generateCode({ payload }, { call, put }) {
      const response = yield call(generateCode, payload);
      yield put({
        type: 'registerGenerateCode',
        payload: response,
      });
    },

    *captcha({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload);
      yield put({
        type: 'registerHandleCaptcha',
        payload: response,
      });
    },
    *checkCaptcha({ payload }, { call, put }) {
      const response = yield call(checkCaptcha, payload);
      yield put({
        type: 'registerCheckCaptcha',
        payload: response,
      });
    },
    *checkGenerateImg({ payload }, { call, put }) {
      const response = yield call(checkGenerateImg, payload);
      yield put({
        type: 'registerCheckCaptcha',
        payload: response,
      });
    },
    *checkUser({ payload }, { call, put }) {
      const response = yield call(checkUser, payload);
      yield put({
        type: 'registerCheckUser',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *changePassword({ payload }, { call, put }) {
      const response = yield call(changePassword, payload);
      yield put({
        type: 'userChangePassword',
        payload: response,
      });
    },
  },

  reducers: {
    registerInit(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
        data: payload.data,
        returnType: 'getInit',
      };
    },
    registerGenerateCode(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      // console.log(state);
      return {
        ...state,
        resultCode: payload.resultCode,
        data: payload.data,
        returnType: 'generateCode',
      };
    },

    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'submit',
      };
    },

    registerHandleCaptcha(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'captcha',
      };
    },
    registerCheckCaptcha(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    checkGenerateImg(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    registerCheckUser(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    userChangePassword(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'changePassword',
      };
    },
  },
};

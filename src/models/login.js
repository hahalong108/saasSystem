import { routerRedux } from 'dva/router';
import {
  fakeAccountLogin,
  generateCode,
  getLoginCaptcha,
  verifyLoginCaptcha,
  getGenerateImg,
  checkGenerateImg,
  menuTree,
  authorityTagsArray,
  logoutResult,
} from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',
  state: {
    resultCode: '',
    data: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
    },
    *logout({ payload }, { call, put, select }) {
      const response = yield call(logoutResult, payload);
      localStorage.removeItem('token');
      localStorage.removeItem('authorityTags');
      localStorage.removeItem('menuData');
      try {
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    *getCode(_, { call, put }) {
      const response = yield call(generateCode);
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
    *sendImg({ payload }, { call, put }) {
      const response = yield call(getGenerateImg, payload);
      yield put({
        type: 'GenerateImg',
        payload: response,
      });
      document.getElementById('freshImg').src = response;
    },
    *verifyCode({ payload }, { call, put }) {
      const response = yield call(checkGenerateImg, payload);
      yield put({
        type: 'verifyGenerateImg',
        payload: response,
      });
    },
    *menuTree({ payload }, { call, put }) {
      const response = yield call(menuTree, payload);
      yield put({
        type: 'menuTreeResult',
        payload: response,
      });
    },
    *authorityTags({ payload }, { call, put }) {
      const response = yield call(authorityTagsArray, payload);
      if (response.resultCode == 1000) {
        localStorage.setItem('authorityTags', response.data);
        yield put(routerRedux.push('/product/index'));
        // ?jump=1
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      // setAuthority(localStorage.getItem("loginUserMail"));
      return {
        ...state,
        resultCode: payload.resultCode,
        resultDesc: payload.desc,
        returnType: 'loginstate',
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
        returnType: 'getPhoneCode',
      };
    },
    verifyPhoneCode(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    GenerateImg(state, { payload }) {
      return {
        ...state,
        // url: payload.url,
      };
    },
    verifyGenerateImg(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnName: 'verifyGenerateImg',
      };
    },
    menuTreeResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        menuTreeData: payload.data,
        returnType: 'getmenuTree',
      };
    },
    authorityTagsArray(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        authorityTags: payload.data,
        returnType: 'authorityTags',
      };
    },
  },
};

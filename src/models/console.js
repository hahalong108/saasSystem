import {
  getWarningEventsResult,
  getNoticeResult,
  getProductStateResult,
  getProductListResult,
  getDocumentList,
} from '../services/api';

export default {
  namespace: 'console',
  state: {
    data: '',
    resultCode: '',
    returnType: '',
  },

  effects: {
    *getWarningEvents({ payload }, { call, put }) {
      const response = yield call(getWarningEventsResult, payload);
      yield put({
        type: 'getWarningEventsResult',
        payload: response,
      });
    },

    *getNotice({ payload }, { call, put }) {
      const response = yield call(getNoticeResult, payload);
      yield put({
        type: 'getNoticeResult',
        payload: response,
      });
    },
    *getProductState({ payload }, { call, put }) {
      const response = yield call(getProductStateResult, payload);
      yield put({
        type: 'getProductStateResult',
        payload: response,
      });
    },
    *getProductList({ payload }, { call, put }) {
      const response = yield call(getProductListResult, payload);
      yield put({
        type: 'getProductListResult',
        payload: response,
      });
    },
    *getProductDocument({ payload }, { call, put }) {
      const response = yield call(getDocumentList, payload);
      yield put({
        type: 'getDocumentList',
        payload: response,
      });
    },
  },

  reducers: {
    getWarningEventsResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getWarningEvents',
      };
    },

    getNoticeResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getNotice',
      };
    },
    getProductStateResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getProductState',
      };
    },
    getProductListResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getProductList',
      };
    },
    getDocumentList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getDocumentList',
      };
    },
  },
};

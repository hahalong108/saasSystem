import {
  applicationlistResult,
  queryProductResult,
  getCaseList,
  queryVersion,
  queryCompany,
  priceList,
  creatOrder,
  domainName,
  queryHasCompany,
} from '../services/api';

export default {
  namespace: 'product',
  state: {},

  effects: {
    *initPage({ payload }, { call, put }) {
      const response = yield call(initManageOrder, payload);
      yield put({
        type: 'getInitPage',
        payload: response,
      });
    },

    *getAll({ payload }, { call, put }) {
      const response = yield call(applicationlistResult, payload);
      yield put({
        type: 'getAllProduct',
        payload: response,
      });
    },

    *getProduct({ payload }, { call, put }) {
      const response = yield call(queryProductResult, payload);
      yield put({
        type: 'getProductItem',
        payload: response,
      });
    },

    *getCase({ payload }, { call, put }) {
      const response = yield call(getCaseList, payload);
      yield put({
        type: 'getCaseList',
        payload: response,
      });
    },

    *queryVersion({ payload }, { call, put }) {
      const response = yield call(queryVersion, payload);
      yield put({
        type: 'getQueryVersion',
        payload: response,
      });
    },
    *queryCompany({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload);
      yield put({
        type: 'getQueryCompany',
        payload: response,
      });
    },
    *priceList({ payload }, { call, put }) {
      const response = yield call(priceList, payload);
      yield put({
        type: 'getPriceList',
        payload: response,
      });
    },
    *creatOrder({ payload }, { call, put }) {
      const response = yield call(creatOrder, payload);
      yield put({
        type: 'GetCreatOrder',
        payload: response,
      });
    },
    *domainName({ payload }, { call, put }) {
      const response = yield call(domainName, payload);
      yield put({
        type: 'GetDomainName',
        payload: response,
      });
    },
    *queryHasCompany({ payload }, { call, put }) {
      const response = yield call(queryHasCompany, payload);
      yield put({
        type: 'getQueryHasCompany',
        payload: response,
      });
    },
  },

  reducers: {
    getInitPage(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        page: payload.page,
        resultCode: payload.resultCode,
        returnType: 'getInitPage',
      };
    },

    getAllProduct(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'getAll',
      };
    },
    getProductItem(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'getProduct',
      };
    },
    getCaseList(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'getCase',
      };
    },

    getQueryVersion(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'queryVersion',
      };
    },
    getQueryCompany(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'queryCompany',
      };
    },
    getPriceList(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'priceList',
      };
    },
    GetCreatOrder(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        desc: payload.desc,
        resultCode: payload.resultCode,
        returnType: 'creatOrder',
      };
    },
    GetDomainName(state, { payload }) {
      return {
        ...state,
        desc: payload.desc,
        resultCode: payload.resultCode,
        returnType: 'domainName',
      };
    },
    getQueryHasCompany(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'queryHasCompany',
      };
    },
  },
};

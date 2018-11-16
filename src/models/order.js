import {
  initManageOrder,
  selectOrder,
  initUpload,
  createRenewal,
  initData,
  payZhifubao,
  searchApplyResult,
  updateApplyResult,
  queryApplyResult,
  applicationlistResult,
  workListPageResult,
  createWorkListResult,
  generateCode,
  queryListDetailResult,
  queryReplayDetailResult,
  createReplyResult,
  incomeExpenses,
  applicationState,
  incomeExpensesCheck,
  comfirmListResult,
  createXianxia,
  verifyConstract,
} from '../services/api';

export default {
  namespace: 'order',
  state: {
    resultCode: '',
    resultData: [],
    resultPage: {},
    returnType: '',
    queryApplyData: {},
  },

  effects: {
    *initPage({ payload }, { call, put }) {
      const response = yield call(initManageOrder, payload);
      yield put({
        type: 'getInitPage',
        payload: response,
      });
    },

    *selectOrder({ payload }, { call, put }) {
      const response = yield call(selectOrder, payload);
      yield put({
        type: 'getSelectOrder',
        payload: response,
      });
    },

    *initUpload({ payload }, { call, put }) {
      const response = yield call(initUpload, payload);
      yield put({
        type: 'getInitUpload',
        payload: response,
      });
    },
    *createRenewal({ payload }, { call, put }) {
      const response = yield call(createRenewal, payload);
      yield put({
        type: 'getCreateRenewal',
        payload: response,
      });
    },
    *initData({ payload }, { call, put }) {
      const response = yield call(initData, payload);
      yield put({
        type: 'getInitData',
        payload: response,
      });
    },
    *incomeExpenses({ payload }, { call, put }) {
      const response = yield call(incomeExpenses, payload);
      yield put({
        type: 'getIncomeExpenses',
        payload: response,
      });
    },
    *applicationState({ payload }, { call, put }) {
      const response = yield call(applicationState, payload);
      yield put({
        type: 'getApplicationState',
        payload: response,
      });
    },
    // 续费管理--begin
    *searchApply({ payload }, { call, put }) {
      const response = yield call(searchApplyResult, payload);
      yield put({
        type: 'searchApplyResult',
        payload: response,
      });
    },
    *updateApply({ payload }, { call, put }) {
      const response = yield call(updateApplyResult, payload);
      yield put({
        type: 'updateApplyResult',
        payload: response,
      });
    },
    *queryApply({ payload }, { call, put }) {
      const response = yield call(queryApplyResult, payload);
      yield put({
        type: 'queryApplyResult',
        payload: response,
      });
    },
    *incomeExpensesCheck({ payload }, { call, put }) {
      const response = yield call(incomeExpensesCheck, payload);
      yield put({
        type: 'getIncomeExpensesCheck',
        payload: response,
      });
    },

    // 续费管理--end

    *payZhifubao({ payload }, { call, put }) {
      const response = yield call(payZhifubao, payload);
      yield put({
        type: 'getPayZhifubao',
        payload: response,
      });
    },

    *applicationlist({ payload }, { call, put }) {
      const response = yield call(applicationlistResult, payload);
      yield put({
        type: 'applicationlistResult',
        payload: response,
      });
    },
    *workListPage({ payload }, { call, put }) {
      const response = yield call(workListPageResult, payload);
      yield put({
        type: 'workListPageResult',
        payload: response,
      });
    },
    *createWorkList({ payload }, { call, put }) {
      const response = yield call(createWorkListResult, payload);
      yield put({
        type: 'createWorkListResult',
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
    *queryListDetail({ payload }, { call, put }) {
      const response = yield call(queryListDetailResult, payload);
      yield put({
        type: 'queryListDetailResult',
        payload: response,
      });
    },

    *queryReplayDetail({ payload }, { call, put }) {
      const response = yield call(queryReplayDetailResult, payload);
      yield put({
        type: 'queryReplayDetailResult',
        payload: response,
      });
    },
    *createReply({ payload }, { call, put }) {
      const response = yield call(createReplyResult, payload);
      yield put({
        type: 'createReplyResult',
        payload: response,
      });
    },
    *comfirmList({ payload }, { call, put }) {
      const response = yield call(comfirmListResult, payload);
      yield put({
        type: 'comfirmListResult',
        payload: response,
      });
    },
    *createXianxia({ payload }, { call, put }) {
      const response = yield call(createXianxia, payload);
      yield put({
        type: 'getCreateXianxia',
        payload: response,
      });
    },
    *verifyConstract({ payload }, { call, put }) {
      const response = yield call(verifyConstract, payload);
      yield put({
        type: 'getVerifyConstract',
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

    getSelectOrder(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'selectOrder',
      };
    },

    getInitUpload(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'initUpload',
      };
    },
    getCreateRenewal(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'createRenewal',
      };
    },
    getInitData(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'initData',
      };
    },

    getIncomeExpenses(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        page: payload.page,
        resultCode: payload.resultCode,
        returnType: 'incomeExpenses',
      };
    },

    getApplicationState(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        page: payload.page,
        resultCode: payload.resultCode,
        returnType: 'applicationState',
      };
    },
    // 续费管理--begin
    searchApplyResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        resultPage: payload.page,
        returnType: 'searchApply',
      };
    },
    updateApplyResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateApply',
      };
    },
    queryApplyResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        queryApplyData: payload.data,
        returnType: 'queryApply',
      };
    },

    // 续费管理--end
    getPayZhifubao(state, { payload }) {
      console.log(payload);
      return {
        data: payload,
        returnType: 'payZhifubao',
      };
    },
    applicationlistResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'applicationlist',
      };
    },
    workListPageResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        resultPage: payload.page,
        returnType: 'workListPage',
      };
    },
    createWorkListResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'createWorkList',
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
    queryListDetailResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'queryListDetail',
      };
    },
    queryReplayDetailResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'queryReplay',
      };
    },
    createReplyResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'createReply',
      };
    },
    getIncomeExpensesCheck(state, { payload }) {
      return {
        ...state,
        desc: payload.desc,
        resultCode: payload.resultCode,
        returnType: 'incomeExpensesCheck',
      };
    },
    comfirmListResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'comfirmList',
      };
    },
    getCreateXianxia(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'createXianxia',
      };
    },
    getVerifyConstract(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'verifyConstract',
      };
    },
  },
};

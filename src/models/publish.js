import {
  initResource,
  deployResource,
  applicationPageResult,
  createProductResult,
  updateProductResult,
  deleteProductResult,
  queryProductResult,
  queryIplist,
  cpuLoad,
  cpuUtilization,
  diskSpaceusag,
  diskSpaceusagBoot,
  diskSpaceusagData,
  memoryUsage,
  networkTrafficoneth0,
  swapUsage,
  softwareinfos,
  restartService,
  documentPageResult,
  deleteDocumentResult,
  queryUserResult,
  getAppIdResult,
  getVersionIdResult,
  dictListResult,
  createDocumentResult,
  applicationPageDetails,
  createApplication,
  updateApplication,
  deleteApplication,
  queryApplication,
  auditingApplication,
  submitAuditing,
  casePage,
  applicationlistResult,
  createCase,
  deleteCase,
  checkConfig,
} from '../services/api';

export default {
  namespace: 'publish',
  state: {
    resultCode: 0,
    resultData: [],
    returnType: '',
    desc: '',
  },

  effects: {
    *initResource({ payload }, { call, put }) {
      const response = yield call(initResource, payload);
      yield put({
        type: 'getInitResource',
        payload: response,
      });
    },
    *deployResource({ payload }, { call, put }) {
      const response = yield call(deployResource, payload);
      yield put({
        type: 'getDeployResource',
        payload: response,
      });
    },
    *applicationPage({ payload }, { call, put }) {
      const response = yield call(applicationPageResult, payload);
      yield put({
        type: 'applicationPageResult',
        payload: response,
      });
    },
    *createProduct({ payload }, { call, put }) {
      const response = yield call(createProductResult, payload);
      yield put({
        type: 'createProductResult',
        payload: response,
      });
    },
    *updateProduct({ payload }, { call, put }) {
      const response = yield call(updateProductResult, payload);
      yield put({
        type: 'updateProductResult',
        payload: response,
      });
    },
    *deleteProduct({ payload }, { call, put }) {
      const response = yield call(deleteProductResult, payload);
      yield put({
        type: 'deleteProductResult',
        payload: response,
      });
    },
    *queryProduct({ payload }, { call, put }) {
      const response = yield call(queryProductResult, payload);
      yield put({
        type: 'queryProductResult',
        payload: response,
      });
    },
    *applicationPageDetails({ payload }, { call, put }) {
      const response = yield call(applicationPageDetails, payload);
      yield put({
        type: 'getaApplicationPageDetails',
        payload: response,
      });
    },
    *createApplication({ payload }, { call, put }) {
      const response = yield call(createApplication, payload);
      yield put({
        type: 'getCreateApplication',
        payload: response,
      });
    },
    *updateApplication({ payload }, { call, put }) {
      const response = yield call(updateApplication, payload);
      yield put({
        type: 'getUpdateApplication',
        payload: response,
      });
    },
    *deleteApplication({ payload }, { call, put }) {
      const response = yield call(deleteApplication, payload);
      yield put({
        type: 'getDeleteApplication',
        payload: response,
      });
    },
    *queryApplication({ payload }, { call, put }) {
      const response = yield call(queryApplication, payload);
      yield put({
        type: 'getQueryApplication',
        payload: response,
      });
    },
    *auditingApplication({ payload }, { call, put }) {
      const response = yield call(auditingApplication, payload);
      yield put({
        type: 'getAuditingApplication',
        payload: response,
      });
    },
    *submitAuditing({ payload }, { call, put }) {
      const response = yield call(submitAuditing, payload);
      yield put({
        type: 'getSubmitAuditing',
        payload: response,
      });
    },
    *documentPage({ payload }, { call, put }) {
      const response = yield call(documentPageResult, payload);
      yield put({
        type: 'documentPageResult',
        payload: response,
      });
    },
    *deleteDocument({ payload }, { call, put }) {
      const response = yield call(deleteDocumentResult, payload);
      yield put({
        type: 'deleteDocumentResult',
        payload: response,
      });
    },
    *queryUser({ payload }, { call, put }) {
      const response = yield call(queryUserResult, payload);
      yield put({
        type: 'queryUserResult',
        payload: response,
      });
    },
    *getAppId({ payload }, { call, put }) {
      const response = yield call(getAppIdResult, payload);
      yield put({
        type: 'getAppIdResult',
        payload: response,
      });
    },
    *getVersionId({ payload }, { call, put }) {
      const response = yield call(getVersionIdResult, payload);
      yield put({
        type: 'getVersionIdResult',
        payload: response,
      });
    },
    *dictList({ payload }, { call, put }) {
      const response = yield call(dictListResult, payload);
      yield put({
        type: 'dictListResult',
        payload: response,
      });
    },
    *createDocument({ payload }, { call, put }) {
      const response = yield call(createDocumentResult, payload);
      yield put({
        type: 'createDocumentResult',
        payload: response,
      });
    },
    *checkConfig({ payload }, { call, put }) {
      const response = yield call(checkConfig, payload);
      yield put({
        type: 'getCheckConfig',
        payload: response,
      });
    },

    *queryIplist({ payload }, { call, put }) {
      const response = yield call(queryIplist, payload);
      yield put({
        type: 'getQueryIplist',
        payload: response,
      });
    },
    *cpuLoad({ payload }, { call, put }) {
      const response = yield call(cpuLoad, payload);
      yield put({
        type: 'getCpuLoad',
        payload: response,
      });
    },
    *cpuUtilization({ payload }, { call, put }) {
      const response = yield call(cpuUtilization, payload);
      yield put({
        type: 'getCpuUtilization',
        payload: response,
      });
    },
    *diskSpaceusag({ payload }, { call, put }) {
      const response = yield call(diskSpaceusag, payload);
      yield put({
        type: 'getDiskSpaceusag',
        payload: response,
      });
    },
    *diskSpaceusagBoot({ payload }, { call, put }) {
      const response = yield call(diskSpaceusagBoot, payload);
      yield put({
        type: 'getDiskSpaceusagBoot',
        payload: response,
      });
    },
    *diskSpaceusagData({ payload }, { call, put }) {
      const response = yield call(diskSpaceusagData, payload);
      yield put({
        type: 'getDiskSpaceusagData',
        payload: response,
      });
    },
    *memoryUsage({ payload }, { call, put }) {
      const response = yield call(memoryUsage, payload);
      yield put({
        type: 'getMemoryUsage',
        payload: response,
      });
    },
    *networkTrafficoneth0({ payload }, { call, put }) {
      const response = yield call(networkTrafficoneth0, payload);
      yield put({
        type: 'getNetworkTrafficoneth0',
        payload: response,
      });
    },
    *swapUsage({ payload }, { call, put }) {
      const response = yield call(swapUsage, payload);
      yield put({
        type: 'getSwapUsage',
        payload: response,
      });
    },
    *softwareinfos({ payload }, { call, put }) {
      const response = yield call(softwareinfos, payload);
      yield put({
        type: 'getSoftwareinfos',
        payload: response,
      });
    },
    *restartService({ payload }, { call, put }) {
      const response = yield call(restartService, payload);
      yield put({
        type: 'getRestartService',
        payload: response,
      });
    },

    *casePage({ payload }, { call, put }) {
      const response = yield call(casePage, payload);
      yield put({
        type: 'getCasePage',
        payload: response,
      });
    },
    *createCase({ payload }, { call, put }) {
      const response = yield call(createCase, payload);
      yield put({
        type: 'getCreateCase',
        payload: response,
      });
    },
    *deleteCase({ payload }, { call, put }) {
      const response = yield call(deleteCase, payload);
      yield put({
        type: 'getDeleteCase',
        payload: response,
      });
    },
    *applicationlist({ payload }, { call, put }) {
      const response = yield call(applicationlistResult, payload);
      yield put({
        type: 'getApplicationlist',
        payload: response,
      });
    },
  },

  reducers: {
    getInitResource(state, { payload }) {
      return {
        data: payload.data,
        page: payload.page,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'initResource',
      };
    },
    getDeployResource(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'deployResource',
      };
    },
    applicationPageResult(state, { payload }) {
      return {
        resultData: payload.data,
        resultPage: payload.page,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'applicationPage',
      };
    },
    createProductResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'createProduct',
        desc: payload.desc,
      };
    },
    updateProductResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'updateProduct',
        desc: payload.desc,
      };
    },
    deleteProductResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'deleteProduct',
        desc: payload.desc,
      };
    },
    queryProductResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'queryProduct',
        data: payload.data,
      };
    },
    getaApplicationPageDetails(state, { payload }) {
      return {
        resultData: payload.data,
        resultPage: payload.page,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'applicationPageDetails',
      };
    },
    getCreateApplication(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'createApplication',
        desc: payload.desc,
      };
    },
    getUpdateApplication(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'updateApplication',
        desc: payload.desc,
      };
    },
    getDeleteApplication(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'deleteApplication',
        desc: payload.desc,
      };
    },
    getQueryApplication(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'queryApplication',
        data: payload.data,
      };
    },
    getAuditingApplication(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'auditingApplication',
      };
    },
    getSubmitAuditing(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'submitAuditing',
      };
    },
    documentPageResult(state, { payload }) {
      return {
        resultData: payload.data,
        resultPage: payload.page,
        resultCode: payload.resultCode,
        returnType: 'documentPage',
      };
    },
    deleteDocumentResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        returnType: 'deleteDocument',
      };
    },
    queryUserResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'queryUser',
      };
    },
    getAppIdResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getAppId',
      };
    },
    getVersionIdResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getVersionId',
      };
    },
    dictListResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'dictList',
      };
    },
    createDocumentResult(state, { payload }) {
      return {
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'createDocument',
      };
    },

    getQueryIplist(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'queryIplist',
      };
    },
    getCpuLoad(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'cpuLoad',
      };
    },
    getCpuUtilization(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'cpuUtilization',
      };
    },
    getDiskSpaceusag(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'diskSpaceusag',
      };
    },
    getDiskSpaceusagBoot(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'diskSpaceusagBoot',
      };
    },
    getDiskSpaceusagData(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'diskSpaceusagData',
      };
    },
    getMemoryUsage(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'memoryUsage',
      };
    },
    getNetworkTrafficoneth0(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'networkTrafficoneth0',
      };
    },
    getSwapUsage(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'swapUsage',
      };
    },
    getSoftwareinfos(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'softwareinfos',
        desc: payload.desc,
      };
    },

    getRestartService(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'restartService',
      };
    },
    getCasePage(state, { payload }) {
      return {
        data: payload.data,
        page: payload.page,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'casePage',
      };
    },
    getCreateCase(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'createCase',
      };
    },
    getDeleteCase(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'deleteCase',
      };
    },
    getApplicationlist(state, { payload }) {
      return {
        data: payload.data,
        resultCode: payload.resultCode,
        returnType: 'applicationlist',
      };
    },
    getCheckConfig(state, { payload }) {
      return {
        data: payload.data,
        desc: payload.desc,
        resultCode: payload.resultCode,
        returnType: 'checkConfig',
      };
    },
  },
};

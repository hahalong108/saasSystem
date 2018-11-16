import {
  queryUserList,
  CompanyIdList,
  checkUser,
  deleteUsers,
  createUsers,
  updateUsers,
  getRoles,
  setRoles,
  getDepartmentTree,
  haveRolesList,
  resetPasswordFun,
  getUserMassage,
  verifyLoginCaptcha,
  generateCode,
  checkPhoneAlone,
  searchRolePage,
  createRoles,
  deleteRoles,
  updateRoles,
  authorityTree,
  setAuthority,
  initRoleTree,
  createPermission,
  updatePermission,
  deletePermission,
  selectPermissionName,
  getModelList,
  getLogPageList,
  getSubModelList,
  getMessagePageList,
  updateReadResult,
  queryNoticeResult,
  updateNoticeResult,
  sysSettingResult,
  updateSettingResult,
  getSettingResult,
  companyTree,
  createCompany,
  updateCompany,
  deleteCompany,
  getDepartmentTreeData,
  checkPhoneAloneUpdata,
  getUserInformation,
} from '../services/api';

export default {
  namespace: 'manage',
  state: {
    list: [],
    data: [],
    resultCode: '',
    page: {},
    returnType: '',
    treeData: [],
    treeDatas: [],
    logListData: [],
    logListPage: {},
  },

  effects: {
    // 用户管理------------------------begin
    *submit({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'queryUserList',
        payload: response,
      });
    },
    *getUserInfor({ payload }, { call, put }) {
      const response = yield call(getUserInformation, payload);
      yield put({
        type: 'getUserInformation',
        payload: response,
      });
    },
    *getCompanyId({ payload }, { call, put }) {
      const response = yield call(CompanyIdList, payload);
      yield put({
        type: 'CompanyIdList',
        payload: response,
      });
    },
    *checkUser({ payload }, { call, put }) {
      //用户名是否重复
      const response = yield call(checkUser, payload);
      yield put({
        type: 'registerCheckUser',
        payload: response,
      });
    },
    *deleteUsers({ payload }, { call, put }) {
      const response = yield call(deleteUsers, payload);
      yield put({
        type: 'deleteUsersResult',
        payload: response,
      });
    },
    *createUsers({ payload }, { call, put }) {
      const response = yield call(createUsers, payload);
      yield put({
        type: 'createUsersResult',
        payload: response,
      });
    },
    *updateUsers({ payload }, { call, put }) {
      const response = yield call(updateUsers, payload);
      yield put({
        type: 'updateUsersResult',
        payload: response,
      });
    },
    *getRole({ payload }, { call, put }) {
      const response = yield call(getRoles, payload);
      yield put({
        type: 'getRoleAll',
        payload: response,
      });
    },
    *setRole({ payload }, { call, put }) {
      const response = yield call(setRoles, payload);
      yield put({
        type: 'setRoles',
        payload: response,
      });
    },
    *getTree({ payload }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      yield put({
        type: 'getDepartmentTree',
        payload: response,
      });
    },
    *getTreeData({ payload }, { call, put }) {
      const response = yield call(getDepartmentTreeData, payload);
      yield put({
        type: 'getDepartmentTreeData',
        payload: response,
      });
    },
    *haveRoles({ payload }, { call, put }) {
      const response = yield call(haveRolesList, payload);
      yield put({
        type: 'haveRolesList',
        payload: response,
      });
    },
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(resetPasswordFun, payload);
      yield put({
        type: 'resetPasswordFun',
        payload: response,
      });
    },
    *userMassage({ payload }, { call, put }) {
      const response = yield call(getUserMassage, payload);
      yield put({
        type: 'getUserMassage',
        payload: response,
      });
    },
    *getCode(_, { call, put }) {
      const response = yield call(generateCode);
      yield put({
        type: 'getGenerateCode',
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
    *checkPhone({ payload }, { call, put }) {
      const response = yield call(checkPhoneAlone, payload);
      yield put({
        type: 'checkPhoneAlone',
        payload: response,
      });
    },
    *checkPhoneUpdata({ payload }, { call, put }) {
      const response = yield call(checkPhoneAloneUpdata, payload);
      yield put({
        type: 'checkPhoneAloneUpdata',
        payload: response,
      });
    },

    // 角色管理------------------------begin
    *searchRole({ payload }, { call, put }) {
      const response = yield call(searchRolePage, payload);
      yield put({
        type: 'searchRolePage',
        payload: response,
      });
    },
    *createRoles({ payload }, { call, put }) {
      const response = yield call(createRoles, payload);
      yield put({
        type: 'createRolesResult',
        payload: response,
      });
    },
    *deleteRoles({ payload }, { call, put }) {
      const response = yield call(deleteRoles, payload);
      yield put({
        type: 'deleteRolesResult',
        payload: response,
      });
    },
    *updateRoles({ payload }, { call, put }) {
      const response = yield call(updateRoles, payload);
      yield put({
        type: 'updateRolesResult',
        payload: response,
      });
    },
    *authorityTree({ payload }, { call, put }) {
      const response = yield call(authorityTree, payload);
      yield put({
        type: 'authorityTreeResult',
        payload: response,
      });
    },
    *setAuthority({ payload }, { call, put }) {
      const response = yield call(setAuthority, payload);
      yield put({
        type: 'setAuthorityResult',
        payload: response,
      });
    },
    // 日志管理------------------------begin
    *getModel({ payload }, { call, put }) {
      const response = yield call(getModelList, payload);
      yield put({
        type: 'getModelList',
        payload: response,
      });
    },
    *logPage({ payload }, { call, put }) {
      const response = yield call(getLogPageList, payload);
      yield put({
        type: 'logPageList',
        payload: response,
      });
    },
    *getSubModel({ payload }, { call, put }) {
      const response = yield call(getSubModelList, payload);
      yield put({
        type: 'getSubModelList',
        payload: response,
      });
    },
    // 消息管理------------------------begin
    *messagePage({ payload }, { call, put }) {
      const response = yield call(getMessagePageList, payload);
      yield put({
        type: 'getMessagePageList',
        payload: response,
      });
    },
    *updateRead({ payload }, { call, put }) {
      const response = yield call(updateReadResult, payload);
      yield put({
        type: 'updateReadResult',
        payload: response,
      });
    },
    *queryNotice({ payload }, { call, put }) {
      const response = yield call(queryNoticeResult, payload);
      yield put({
        type: 'queryNoticeResult',
        payload: response,
      });
    },
    *updateNotice({ payload }, { call, put }) {
      const response = yield call(updateNoticeResult, payload);
      yield put({
        type: 'updateNoticeResult',
        payload: response,
      });
    },
    *sysSetting({ payload }, { call, put }) {
      const response = yield call(sysSettingResult, payload);
      yield put({
        type: 'sysSettingResult',
        payload: response,
      });
    },
    *updateSetting({ payload }, { call, put }) {
      const response = yield call(updateSettingResult, payload);
      yield put({
        type: 'updateSettingResult',
        payload: response,
      });
    },
    *getSetting({ payload }, { call, put }) {
      const response = yield call(getSettingResult, payload);
      yield put({
        type: 'getSettingResult',
        payload: response,
      });
    },

    *initRoleTree(_, { call, put }) {
      const response = yield call(initRoleTree);
      yield put({
        type: 'roleTree',
        payload: response,
      });
    },
    *createPermission({ payload }, { call, put }) {
      const response = yield call(createPermission, payload);
      yield put({
        type: 'authorityCreatePermission',
        payload: response,
      });
    },
    *updatePermission({ payload }, { call, put }) {
      const response = yield call(updatePermission, payload);
      yield put({
        type: 'authorityUpdatePermission',
        payload: response,
      });
    },
    *deletePermission({ payload }, { call, put }) {
      const response = yield call(deletePermission, payload);
      yield put({
        type: 'authorityDeletePermission',
        payload: response,
      });
    },
    *selectPermissionName({ payload }, { call, put }) {
      const response = yield call(selectPermissionName, payload);
      yield put({
        type: 'permissionName',
        payload: response,
      });
    },
    *companyTree({ payload }, { call, put }) {
      const response = yield call(companyTree, payload);
      yield put({
        type: 'getCompanyTree',
        payload: response,
      });
    },
    *createCompany({ payload }, { call, put }) {
      const response = yield call(createCompany, payload);
      yield put({
        type: 'getCreateCompany',
        payload: response,
      });
    },
    *updateCompany({ payload }, { call, put }) {
      const response = yield call(updateCompany, payload);
      yield put({
        type: 'getUpdateCompany',
        payload: response,
      });
    },
    *deleteCompany({ payload }, { call, put }) {
      const response = yield call(deleteCompany, payload);
      yield put({
        type: 'getDeleteCompany',
        payload: response,
      });
    },
  },

  reducers: {
    // 用户管理------------------------begin
    queryUserList(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        page: payload.page,
        returnType: 'pageSearch',
      };
    },
    getUserInformation(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        resultCode: payload.resultCode,
        page: payload.page,
        returnType: 'getUserInfor',
      };
    },
    
    CompanyIdList(state, { payload }) {
      return {
        ...state,
        list: payload.data,
        returnType: 'companyList',
        resultCode: payload.resultCode,
      };
    },
    registerCheckUser(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'checkUser',
      };
    },
    deleteUsersResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'deleteUsers',
      };
    },
    createUsersResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'createUsers',
      };
    },
    updateUsersResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateUsers',
      };
    },
    getRoleAll(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        roleDatas: payload.data,
        returnType: 'getRole',
      };
    },
    setRoles(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'setRole',
      };
    },
    getDepartmentTree(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        treeData: payload.data,
        returnType: 'getTree',
      };
    },
    getDepartmentTreeData(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        treeDatas: payload.data,
        returnType: 'getTreeData',
      };
    },

    haveRolesList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        rolesList: payload.data,
        returnType: 'rolesList',
      };
    },
    resetPasswordFun(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'resetPassword',
      };
    },

    getUserMassage(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        userMassageData: payload.data,
        returnType: 'userMassage',
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
    verifyPhoneCode(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
      };
    },
    checkPhoneAlone(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'checkPhone',
      };
    },
    checkPhoneAloneUpdata(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultDatas: payload.data,
        returnType: 'checkPhoneUpdata',
      };
    },

    // 角色管理------------------------begin
    searchRolePage(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        resultPage: payload.page,
        returnType: 'searchRole',
      };
    },
    createRolesResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'createRole',
      };
    },
    deleteRolesResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'deleteRole',
      };
    },
    updateRolesResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateRole',
      };
    },
    authorityTreeResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        authorityTreeData: payload.data,
        returnType: 'authorityTree',
      };
    },
    setAuthorityResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'setAuthority',
      };
    },

    // 日志管理--------------------begin
    getModelList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'getModelList',
        modelListDatas: payload.data,
      };
    },
    logPageList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'logPageList',
        logListData: payload.data,
        logListPage: payload.page,
      };
    },
    getSubModelList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'getSubModelList',
        subModelListDatas: payload.data,
      };
    },
    // 消息管理--------------------begin
    getMessagePageList(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'messagePageList',
        messageListData: payload.data,
        messageListPage: payload.page,
      };
    },
    updateReadResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateRead',
      };
    },
    queryNoticeResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        noticeResult: payload.data,
        returnType: 'queryNotice',
      };
    },
    updateNoticeResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateNotice',
      };
    },
    sysSettingResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'sysSetting',
      };
    },
    updateSettingResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        returnType: 'updateSetting',
      };
    },
    getSettingResult(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        resultData: payload.data,
        returnType: 'getSetting',
      };
    },

    // 权限管理--------------------begin
    roleTree(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        authorityData: payload.data,
        returnType: 'selectPermission',
      };
    },
    authorityCreatePermission(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'createPermission',
      };
    },
    authorityUpdatePermission(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'updatePermission',
      };
    },
    authorityDeletePermission(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'deletePermission',
      };
    },

    permissionName(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        queryDate: payload.data,
        returnType: 'permissionQuery',
      };
    },
    getCompanyTree(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        companyData: payload.data,
        returnType: 'companyTree',
      };
    },
    getCreateCompany(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'createCompany',
      };
    },
    getUpdateCompany(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'updateCompany',
      };
    },
    getDeleteCompany(state, { payload }) {
      return {
        ...state,
        resultCode: payload.resultCode,
        desc: payload.desc,
        returnType: 'deleteCompany',
      };
    },
  },
};

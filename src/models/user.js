import { query as queryUsers, queryCurrent } from '../services/user';
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    returnType:""
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      const pathName = window.location.pathname;
      if (response.resultCode == 2008) {
        if (
          pathName == '/product/index' ||
          pathName == '/product/detail' ||
          pathName == '/product/case' ||
          pathName == '/user/user-detailed/change-password'
        ) {
          return;
        } else {
          yield put(routerRedux.push('/user/login'));
        }
      } else if (response.resultCode == 1000) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data,
        currentCount: action.payload.resultCode,
        returnType:"currentUser"
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};

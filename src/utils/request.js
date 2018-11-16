import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;

  if (response.status != 403) {
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
  }
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    mode: 'cors',
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  let token = localStorage.getItem('token');
  if (token == null || token == undefined) {
    token = '';
  }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        token: token,
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        token: token,
        ...newOptions.headers,
      };
    }
  } else if (newOptions.method === 'GET' || newOptions.method === undefined) {
    newOptions.headers = {
      // Accept: 'application/json',
      // "Content-Type": 'application/x-www-form-urlencoded',
      token: token,
      ...newOptions.headers,
    };
  }

  // 判断浏览器
  const IEVersion = () => {
    let userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
    let isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE) {
      let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      let fIEVersion = parseFloat(RegExp.$1);
      if (fIEVersion === 7) {
        return 7;
      } else if (fIEVersion === 8) {
        return 8;
      } else if (fIEVersion === 9) {
        return 9;
      } else if (fIEVersion === 10) {
        return 10;
      } else {
        return 6; // IE版本<=7
      }
    } else if (isEdge) {
      return 'edge'; // edge
    } else if (isIE11) {
      return 11; // IE11
    } else {
      return -1; // 不是ie浏览器
    }
  };

  // 如果是ie浏览器则全部get 添加时间戳
  let iev = IEVersion();
  if ((iev > -1 || iev === 'edge') && !newOptions.method) {
    if (url.indexOf('?') < 0) {
      url += `?v=${new Date().valueOf()}`;
    } else {
      url += `&v=${new Date().valueOf()}`;
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 304) {
        dispatch(routerRedux.push('/user/login'));
      }
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        // dispatch(routerRedux.push('/exception/403'));
        dispatch(routerRedux.push('/user/login'));
        return;
      }
      // if (status <= 504 && status >= 500) {
      //   dispatch(routerRedux.push('/exception/500'));
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   dispatch(routerRedux.push('/exception/404'));
      // }
    });
}

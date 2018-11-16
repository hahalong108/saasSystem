import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  //ljj 登录
  return request('/api/saas/login', {
    method: 'POST',
    body: params,
  });
}
// 注册密码初始化
export async function getInit() {
  return request('/api/saas/sys-setting/query-map');
}
// 注册获取手机验证码
export async function getCaptcha(params) {
  return request('/api/saas/code/send-phone', {
    method: 'POST',
    body: params,
  });
}
// 注册验证手机验证码
export async function checkCaptcha(params) {
  return request('/api/saas/code/verify-phone', {
    method: 'POST',
    body: params,
  });
}
// 注册邮箱用户名验证
export async function checkUser(params) {
  return request('/api/saas/regist/verify', {
    method: 'POST',
    body: params,
  });
}
// 注册提交
export async function fakeRegister(params) {
  return request('/api/saas/regist', {
    method: 'POST',
    body: params,
  });
}
// 修改密码
export async function changePassword(params) {
  return request('/api/saas/user/forget-password', {
    method: 'POST',
    body: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function generateCode() {
  //ljj 获取四位随机码
  return request('/api/saas/code/random-code');
}
export async function getLoginCaptcha(params) {
  //ljj 发送手机验证码
  return request('/api/saas/code/send-phone', {
    method: 'POST',
    body: params,
  });
}
export async function verifyLoginCaptcha(params) {
  //ljj 验证手机验证码
  return request('/api/saas/code/verify-phone', {
    method: 'POST',
    body: params,
  });
}
export async function getGenerateImg(params) {
  //ljj  获取图片验证码
  return request('/api/saas/code/send-img?width=90&height=40');
}
export async function checkGenerateImg(params) {
  //ljj  验证图片验证码
  return request('/api/saas/code/verify-img', {
    method: 'POST',
    body: params,
  });
}
export async function queryUserList(params) {
  //ljj  分页查询全部用户
  return request('/api/saas/user/page', {
    method: 'POST',
    body: params,
  });
}
export async function getUserInformation(params) {
  //ljj  查询用户信息
  return request('/api/saas/user/page', {
    method: 'POST',
    body: params,
  });
}
export async function CompanyIdList(params) {
  //ljj  获取单位ID
  return request('/api/saas/company/all-company');
}
export async function deleteUsers(params) {
  //ljj  删除用户
  return request('/api/saas/user/delete', {
    method: 'POST',
    body: params,
  });
}
export async function createUsers(params) {
  //ljj  创建用户
  return request('/api/saas/user/create', {
    method: 'POST',
    body: params,
  });
}
export async function initRoleTree(params) {
  return request('/api/saas/permission/tree', {});
}
export async function createPermission(params) {
  return request('/api/saas/permission/create', {
    method: 'POST',
    body: params,
  });
}
export async function updatePermission(params) {
  return request('/api/saas/permission/update', {
    method: 'POST',
    body: params,
  });
}
export async function deletePermission(params) {
  return request('/api/saas/permission/delete', {
    method: 'POST',
    body: params,
  });
}

export async function selectPermissionName(params) {
  return request('/api/saas/permission/query', {
    method: 'POST',
    body: params,
  });
}
export async function updateUsers(params) {
  //ljj  修改用户信息
  return request('/api/saas/user/update', {
    method: 'POST',
    body: params,
  });
}
export async function getRoles(params) {
  //ljj  获取全部角色
  return request('/api/saas/role/all');
}
export async function setRoles(params) {
  //ljj  获取全部角色
  return request('/api/saas/user/role2user', {
    method: 'POST',
    body: params,
  });
}
export async function getDepartmentTree(params) {
  //ljj  获取部门树
  return request('/api/saas/company/department-tree?companyId=' + params.companyId);
}
export async function haveRolesList(params) {
  //ljj  获取用户具有的角色
  return request('/api/saas/role/list?userId=' + params.userId);
}
export async function resetPasswordFun(params) {
  //ljj  用户重置密码
  return request('/api/saas/user/reset-password?userId=' + params.userId);
}
export async function getUserMassage(params) {
  //ljj  查询指定用户信息
  return request('/api/saas/user/query?userId=' + params.userId);
}
export async function checkPhoneAlone(params) {
  //ljj  确定手机号是否唯一
  return request('/api/saas/user/check-phone?userId=' + params.userId + '&phone=' + params.phone);
}
export async function checkPhoneAloneUpdata(params) {
  //ljj  确定手机号是否唯一
  return request('/api/saas/user/check-phone?userId=' + params.userId + '&phone=' + params.phone);
}
export async function searchRolePage(params) {
  //ljj  获取全部角色分页
  return request('/api/saas/role/page', {
    method: 'POST',
    body: params,
  });
}
export async function getDepartmentTreeData(params) {
  //ljj  获取部门树
  return request('/api/saas/company/department-tree?companyId=' + params.companyId);
}
export async function createRoles(params) {
  //ljj  新增角色
  return request('/api/saas/role/create', {
    method: 'POST',
    body: params,
  });
}
export async function deleteRoles(params) {
  //ljj  删除角色
  return request('/api/saas/role/delete', {
    method: 'POST',
    body: params,
  });
}
export async function updateRoles(params) {
  //ljj  修改角色
  return request('/api/saas/role/update', {
    method: 'POST',
    body: params,
  });
}
export async function authorityTree(params) {
  //ljj  获取权限树
  return request('/api/saas/permission/tree?roleId=' + params.roleId);
}
export async function setAuthority(params) {
  //ljj  给角色设置权限
  return request('/api/saas/role/permis2role', {
    method: 'POST',
    body: params,
  });
}
export async function menuTree(params) {
  //ljj  获取控制台菜单列表
  return request('/api/saas/permission/menu-tree');
}
export async function getModelList(params) {
  //ljj  日志/消息管理-获取模块下拉list
  return request('/api/saas/dict/query-dict-bymodel', {
    method: 'POST',
    body: params,
  });
}
export async function getLogPageList(params) {
  //ljj  日志管理-日志分页列表
  return request('/api/saas/log/page', {
    method: 'POST',
    body: params,
  });
}
export async function getSubModelList(params) {
  //ljj  日志/消息管理-获取子模块下拉list
  return request('/api/saas/dict/query-dict-bysubmodel', {
    method: 'POST',
    body: params,
  });
}
export async function getMessagePageList(params) {
  //ljj  消息管理-消息分页列表
  return request('/api/saas/notice/page', {
    method: 'POST',
    body: params,
  });
}
export async function sendEmailToFind(params) {
  //ljj  发邮件找回密码
  return request('/api/saas/user/send-email', {
    method: 'POST',
    body: params,
  });
}
export async function updateReadResult(params) {
  //ljj  信息更改为已读
  return request('/api/saas/notice/update-read', {
    method: 'POST',
    body: params,
  });
}
export async function queryNoticeResult(params) {
  //ljj  查询信息
  return request('/api/saas/notice/query?noticeId=' + params.noticeId);
}
export async function updateNoticeResult(params) {
  //ljj  更新信息
  return request('/api/saas/notice/update', {
    method: 'POST',
    body: params,
  });
}
export async function noticeTotalResult() {
  // ljj newAdd
  return request('/api/saas/notice/total');
}

export async function searchApplyResult(params) {
  // ljj 续费管理-分页查询---------------------
  return request('/api/saas/searchApply', {
    method: 'POST',
    body: params,
  });
}
export async function updateApplyResult(params) {
  // ljj 续费管理-续费---------------------
  return request('/api/saas/renew', {
    method: 'POST',
    body: params,
  });
}
export async function queryApplyResult() {
  // ljj 续费管理-查询续费信息---------------------
  return request('/api/saas/queryApply');
}

// 订单管理分页
export async function initManageOrder(params) {
  return request('/api/saas/order/page', {
    method: 'POST',
    body: params,
  });
}

// 查询订单
export async function selectOrder(params) {
  return request(
    '/api/saas/order/query?orderId=' + params.orderId + '&orderDetId=' + params.orderDetId
  );
}

// 上传初始化文件
export async function initUpload(params) {
  return request('/api/saas/file/upload', {
    method: 'POST',
    body: params,
  });
}

// 订单初始化
export async function initData(params) {
  return request('/api/saas/order/init-data', {
    method: 'POST',
    body: params,
  });
}

// 支付宝支付
export async function payZhifubao(params) {
  return request('/api/saas/pay/create', {
    method: 'POST',
    body: params,
  });
}

// 创建续费订单
export async function createRenewal(params) {
  return request('/api/saas/order/renewal', {
    method: 'POST',
    body: params,
  });
}

// 收支管理分页
export async function incomeExpenses(params) {
  return request('/api/saas/payment/page', {
    method: 'POST',
    body: params,
  });
}
// 收支管理分页
export async function incomeExpensesCheck(params) {
  return request(
    '/api/saas/payment/check?paymentId=' + params.paymentId + '&payType=' + params.payType
  );
}
// 新增订单
export async function creatOrder(params) {
  return request('/api/saas/order/create', {
    method: 'POST',
    body: params,
  });
}
//查询公司是否存在
export async function queryHasCompany(params) {
  return request('/api/saas/company/user-company');
}

// 资源管理初始列表
export async function initResource(params) {
  return request('/api/saas/resources/query-pageserver', {
    method: 'POST',
    body: params,
  });
}
export async function deployResource(params) {
  return request('/api/saas/resources/query-deployment-schedule', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情页初始化下拉选框
export async function queryIplist(params) {
  return request('/api/saas/resources/query-iplist', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情页 CPULOAD 折线图
export async function cpuLoad(params) {
  return request('/api/saas/resources/query-cpuload', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情页 CPUUTILIZATION 面积图
export async function cpuUtilization(params) {
  return request('/api/saas/resources/query-cpuutilization', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情 DISKSPACEUSAGE 饼状图
export async function diskSpaceusag(params) {
  return request('/api/saas/resources/query-diskspaceusage', {
    method: 'POST',
    body: params,
  });
}
// 资源管理详情 DISKSPACEUSAGEBOOT 饼状图
export async function diskSpaceusagBoot(params) {
  return request('/api/saas/resources/query-diskspaceusageboot', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情 DISKSPACEUSAGEDATA 饼状图
export async function diskSpaceusagData(params) {
  return request('/api/saas/resources/query-diskspaceusagedata', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情页 MEMORYUSAGE 面积图
export async function memoryUsage(params) {
  return request('/api/saas/resources/query-memoryusage', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情页 NETWORKTRAFFICONETH0 面积图
export async function networkTrafficoneth0(params) {
  return request('/api/saas/resources/query-networktrafficoneth0', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情 SWAPUSAGE 饼状图
export async function swapUsage(params) {
  return request('/api/saas/resources/query-swap-usage', {
    method: 'POST',
    body: params,
  });
}

// 资源管理详情 获取列表
export async function softwareinfos(params) {
  return request('/api/saas/monitor/query-monitorinfos', {
    method: 'POST',
    body: params,
  });
}
// 资源管理详情 重启
export async function restartService(params) {
  return request('/api/saas/monitor/restart-service', {
    method: 'POST',
    body: params,
  });
}

export async function authorityTagsArray() {
  // ljj 按钮权限
  return request('/api/saas/permission/button');
}

export async function applicationPageResult(params) {
  // ljj 分页查询产品信息
  return request('/api/saas/application/page', {
    method: 'POST',
    body: params,
  });
}

export async function createProductResult(params) {
  // ljj 新增产品信息
  return request('/api/saas/application/create', {
    method: 'POST',
    body: params,
  });
}
// 修改产品信息
export async function updateProductResult(params) {
  return request('/api/saas/application/update', {
    method: 'POST',
    body: params,
  });
}
// 删除产品信息
export async function deleteProductResult(params) {
  return request('/api/saas/application/delete', {
    method: 'POST',
    body: params,
  });
}
// 查询指定产品
export async function queryProductResult(params) {
  return request('/api/saas/application/query?appId=' + params.appId);
}

// 应用版本分页-产品详情
export async function applicationPageDetails(params) {
  return request('/api/saas/app-version/page', {
    method: 'POST',
    body: params,
  });
}
// 新增应用版本-产品详情
export async function createApplication(params) {
  return request('/api/saas/app-version/create', {
    method: 'POST',
    body: params,
  });
}
// 修改应用版本-产品详情
export async function updateApplication(params) {
  return request('/api/saas/app-version/update', {
    method: 'POST',
    body: params,
  });
}
// 删除应用版本-产品详情
export async function deleteApplication(params) {
  return request('/api/saas/app-version/delete', {
    method: 'POST',
    body: params,
  });
}
// 查询指定应用版本-产品详情
export async function queryApplication(params) {
  return request('/api/saas/app-version/query?versionId=' + params.versionId);
}
// 查询上传文件版本一致
export async function checkConfig(params) {
  return request('/api/saas-server/yaml/test-config', {
    method: 'POST',
    body: params,
  });
}
// 审核-产品详情
export async function auditingApplication(params) {
  return request('/api/saas/app-version/review', {
    method: 'POST',
    body: params,
  });
}
// 提交审核-产品详情
export async function submitAuditing(params) {
  return request('/api/saas/app-version/submit-apply', {
    method: 'POST',
    body: params,
  });
}
// 产品的审核通过的最新版本
export async function queryVersion(params) {
  return request('/api/saas/app-version/query-new-version?appId=' + params.appId);
}
// 产品查询公司名称
export async function queryCompany(params) {
  return request('/api/saas/company/query-like?companyName=' + params.companyName);
}
// 产品查询价格列表
export async function priceList(params) {
  return request(
    '/api/saas/app-version/query-prices?appId=' + params.appId + '&versionId=' + params.versionId
  );
}
// 产品域名是否重复
export async function domainName(params) {
  return request(
    '/api/saas/order/check-domain-name?appId=' + params.appId + '&prefix=' + params.prefix
  );
}

// 应用状态管理
export async function applicationState(params) {
  return request('/api/saas/applicationstate/query-pageappstate', {
    method: 'POST',
    body: params,
  });
}
// 案例管理
export async function casePage(params) {
  return request('/api/saas/app-case/page', {
    method: 'POST',
    body: params,
  });
}
// 新建管理
export async function createCase(params) {
  return request('/api/saas/app-case/create', {
    method: 'POST',
    body: params,
  });
}
// 删除管理
export async function deleteCase(params) {
  return request('/api/saas/app-case/delete', {
    method: 'POST',
    body: params,
  });
}

export async function documentPageResult(params) {
  // ljj 分页查询文档信息
  return request('/api/saas/document/page', {
    method: 'POST',
    body: params,
  });
}
export async function deleteDocumentResult(params) {
  // ljj 删除文档信息
  return request('/api/saas/document/delete', {
    method: 'POST',
    body: params,
  });
}
export async function queryUserResult(params) {
  // ljj 产品管理-模糊匹配查询用户信息（所属部门）
  return request(
    '/api/saas/user/query-users-mail-type?mail=' + params.mail + '&type=' + params.type + '&companyId=' + params.companyId
  );
}
export async function getAppIdResult() {
  // ljj 文档管理-获取登录用户产品列表
  return request('/api/saas/application/query-my-app');
}
export async function getVersionIdResult(params) {
  // ljj 文档管理-获取审核通过的版本信息
  return request('/api/saas/app-version/query-app-versions?appId=' + params.appId);
}
export async function dictListResult(params) {
  // ljj 文档管理-查询文档类型字典
  return request(
    '/api/saas/dict/list?tabName=' + params.tabName + '&tabColumn=' + params.tabColumn
  );
}
export async function createDocumentResult(params) {
  // ljj 创建文档信息
  return request('/api/saas/document/create', {
    method: 'POST',
    body: params,
  });
}
export async function applicationlistResult() {
  // ljj 工单管理-获取应用名称列表
  return request('/api/saas/application/all');
}
export async function workListPageResult(params) {
  // ljj 工单管理page分页
  return request('/api/saas/work-order/page', {
    method: 'POST',
    body: params,
  });
}
export async function createWorkListResult(params) {
  // ljj 新建工单
  return request('/api/saas/work-order/create', {
    method: 'POST',
    body: params,
  });
}
export async function queryListDetailResult(params) {
  // ljj 工单详情
  return request('/api/saas/work-order/query?workId=' + params.workId);
}
export async function queryReplayDetailResult(params) {
  // ljj 查询工单回复详情
  return request('/api/saas/work-order/query-reply?workId=' + params.workId);
}

export async function createReplyResult(params) {
  // ljj 新建工单回复
  return request('/api/saas/work-order/create-reply', {
    method: 'POST',
    body: params,
  });
}
export async function sysSettingResult() {
  // ljj 查询全部系统配置
  return request('/api/saas/sys-setting/all');
}
export async function updateSettingResult(params) {
  // ljj 修改系统配置
  return request('/api/saas/sys-setting/update', {
    method: 'POST',
    body: params,
  });
}
export async function getSettingResult(params) {
  // ljj 根据id查询配置信息
  return request('/api/saas/sys-setting/query?sysId=' + params.sysId);
}

// 控制台首页
export async function getWarningEventsResult(params) {
  // ljj 查询预警事件信息
  return request('/api/saas/notice/query-severity-count', {
    method: 'POST',
    body: params,
  });
}
export async function getNoticeResult() {
  // ljj  查询公告列表
  return request('/api/saas/announcement/query-all');
}
export async function getProductStateResult(params) {
  // ljj  获取产品状态
  return request('/api/saas/monitor/query-product-operation-status', {
    method: 'POST',
    body: params,
  });
}
export async function getProductListResult() {
  // ljj  获取产品列表
  return request('/api/saas/application/query-own-app');
}
export async function getDocumentList(params) {
  // ljj 根据id查询产品文档信息
  return request('/api/saas/document/query-home-page?appId=' + params.appId);
}
export async function getCaseList() {
  // ljj  获取有案例的应用
  return request('/api/saas/app-case/query-all');
}
export async function logoutResult() {
  // ljj  注销
  return request('/api/saas/login-out');
}

export async function companyTree() {
  // ljj  注销
  return request('/api/saas/company/tree');
}

export async function createCompany(params) {
  return request('/api/saas/company/create', {
    method: 'POST',
    body: params,
  });
}
export async function updateCompany(params) {
  return request('/api/saas/company/update', {
    method: 'POST',
    body: params,
  });
}
export async function deleteCompany(params) {
  return request('/api/saas/company/delete', {
    method: 'POST',
    body: params,
  });
}
export async function createXianxia(params) {
  return request('/api/saas/pay/create-xianxia', {
    method: 'POST',
    body: params,
  });
}
export async function verifyConstract(params) {
  return request('/api/saas/order-constract/verify', {
    method: 'POST',
    body: params,
  });
}

export async function comfirmListResult(params) {
  // ljj 确认工单
  return request('/api/saas/work-order/update-state', {
    method: 'POST',
    body: params,
  });
}

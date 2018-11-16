var pageSize = 5;
const userStateConst = {
  '1': '正常',
  '2': '用户锁定',
  '3': '用户注销',
};
const userTypeConst = {
  '1': 'SAAS管理员',
  '2': '服务提供方',
  '3': '服务购买方',
  '4': '业务用户',
};
const roleTypeConst = {
  '1': '管理员',
  '2': '发布者',
  '3': '租户',
  '4': '业务',
};
const resultNameConst = {
  '1': '成功',
  '2': '失败',
};
const operationNameConst = {
  '1': '新建',
  '2': '删除',
  '3': '修改',
  '4': '查询列表',
  '5': '查询对象',
  '6': '登陆',
  '7': '登出',
  '8': '重置密码',
  '9': '角色变更',
  '10': '权限变更',
  '11': '提交审核',
  '12': '审核',
  '13': '产品下架',
  '14': '产品升级',
  '15': '订购产品',
  '16': '授权访问',
  '17': '消息确认',
};
const readResultConst = {
  '0': '已读',
  '1': '未读',
};

const manageOrderStatus = {
  '1': '未支付',
  '2': '未初始化',
  '3': '开通中',
  '4': '开通失败',
  '5': '服务中',
  '6': '服务到期',
};
const payType = {
  1: '支付宝',
  2: '银联',
  3: '微信',
  4: '线下合同',
};
const payTypeReverse = {
  支付宝: 1,
  银联: 2,
  微信: 3,
  线下合同: 4,
};
const payState = {
  1: '未支付',
  2: '支付失败',
  3: '支付成功',
  4: '支付完成',
  5: '交易关闭',
};
const sourceState = {
  0: '初始化',
  1: '分配中',
  2: '分配完成，待部署',
  3: '部署中',
  4: '环境部署完成',
  5: '部署完成',
  6: '部署失败',
};

const messageTypeStatus = {
  '1': '告警信息',
  '2': '工单通知',
  '3': '普通信息',
};
const severityStatus = {
  '1': '一般',
  '2': '严重',
  '3': '危急',
};

const getTags = () => {
  let authorityTags = [];
  const authorityTag = localStorage.getItem('authorityTags');
  if (authorityTag != undefined) {
    authorityTags = authorityTag;
  }
  return authorityTags;
};

const ipPath="www.vhsaas.com";
// const ipPath = '10.10.210.102:88';
// const ipPath = '192.168.252.213';
// const ipPath = '192.168.7.220:80';


const workListState = {
  '0': '完成',
  '1': '未完成',
};
const workListSubject = {
  '1': '售前',
  '2': '售后',
  '3': '保修',
  '4': '发票',
  '5': '退款',
};

//权限级别
const permissionGrade = {
  '1': '模块',
  '2': '菜单',
  '3': '页面',
  '4': '按钮',
};

//预警事件
const severityEvent = {
  '1': '一般预警',
  '2': '严重预警',
  '3': '危机预警',
};

//产品状态
const productState = {
  '0': '正常',
  '1': '异常',
};

export {
  pageSize,
  userStateConst,
  userTypeConst,
  roleTypeConst,
  resultNameConst,
  operationNameConst,
  readResultConst,
  manageOrderStatus,
  messageTypeStatus,
  severityStatus,
  getTags,
  saasServer,
  ipPath,
  workListState,
  workListSubject,
  firstLoginChangePassword,
  severityEvent,
  productState,
  passwordComplexity,
  permissionGrade,
  payType,
  payState,
  payTypeReverse,
  sourceState,
};

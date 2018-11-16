import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
    // 支持值为 Object 和 Array
    // 'GET /api/saas/currentUser': {

    //   $desc: '获取当前用户接口',
    //   $params: {
    //     pageSize: {
    //       desc: '分页',
    //       exp: 2,
    //     },
    //   },
    //   $body: {
    //     name: 'Serati Ma',
    //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    //     userid: '00000001',
    //     notifyCount: 12,
    //     resultCode:1000,
    //   },
    // },
    'GET /api/saas/currentUser': (req, res) => { //用户是否已登录，未读信息数，用户名
        res.send({
            data: {
                name: 'Serati Ma',
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                userid: '00000001',
                notifyCount: 12,
            },
            resultCode: 1000,
        });
    },
    // GET POST 可省略
    'GET /api/users': [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ],
    'GET /api/project/notice': getNotice,
    'GET /api/activities': getActivities,
    'GET /api/rule': getRule,
    'POST /api/rule': {
        $params: {
            pageSize: {
                desc: '分页',
                exp: 2,
            },
        },
        $body: postRule,
    },
    'POST /api/forms': (req, res) => {
        res.send({ message: 'Ok' });
    },
    'GET /api/tags': mockjs.mock({
        'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
    }),
    'GET /api/fake_list': getFakeList,
    'GET /api/fake_chart_data': getFakeChartData,
    'GET /api/profile/basic': getProfileBasicData,
    'GET /api/profile/advanced': getProfileAdvancedData,
    'POST /api/saas/login': (req, res) => {
        const { password, userMail, code, loginType, userPhone, phoneCode } = req.body;
        if ((userMail === 'admin@qq.com' && loginType === '1') || (userPhone === '12345678911' && phoneCode === '1234' && loginType === '2')) {
            res.send({
                resultCode: 1000,
                status: 'ok',
                loginType,
                currentAuthority: 'admin',
                returnType: "loginstate",
            });
        } else {
            res.send({
                status: 'error',
                loginType,
                currentAuthority: 'guest',
            });
        }
    },
    'GET /api/saas/code/random-code': (req, res) => { //获取随机四位数
        res.send({ resultCode: 1000, data: '1234', desc: '' });
    },
    'POST /api/saas/code/send-phone': (req, res) => { //发送手机验证码
        res.send({ resultCode: '1000' });
    },
    'POST /api/saas/code/verify-phone': (req, res) => { //验证手机验证码
        res.send({ resultCode: '1000', code: '1234' });
    },
    'GET /api/saas/code/send-img': (req, res) => { //发送图片验证码
        res.send({ url: 'http://192.168.10.179/saas/code/send-img?width=90&height=40' });
    },
    'POST /api/saas/code/verify-img': (req, res) => { //验证图片验证码
        res.send({ resultCode: '1001', desc: '', code: '2GZg' });
    },

    'POST /api/saas/regist': (req, res) => {
        res.send({ resultCode: '1000', currentAuthority: 'user' });
    },
    'POST /api/saas/regist/verify': (req, res) => {
        res.send({ resultCode: '2004' });
    },
    'GET /api/saas/user/check-phone': (req, res) => {
        res.send({ resultCode: 1000 });
    },
    'POST /api/saas/user/delete': (req, res) => {  //删除用户
        res.send({ resultCode: '1000' });
    },
    'POST /api/saas/user/create': (req, res) => {  //新增用户
        res.send({ resultCode: '1000' });
    },
    'POST /api/saas/user/update': (req, res) => {  //修改用户
        res.send({ resultCode: '1000' });
    },
    'POST /api/saas/user/page': (req, res) => { //用户分页搜索
        res.send({
            data: [
                {
                    userId: '1',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '2',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: false,
                    setRoleForUser: true,
                },
                {
                    userId: '3',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: false,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '4',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: false,
                },
                {
                    userId: '5',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: false,
                    resetPassword: true,
                    setRoleForUser: true,
                }, {
                    userId: '6',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: false,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '7',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: false,
                    setRoleForUser: true,
                },
                {
                    userId: '8',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '9',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: false,
                }, {
                    userId: '10',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '11',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: true,
                },
                {
                    userId: '12',
                    userName: 'Q',
                    userPhone: '12345678971',
                    userMail: 'XSFD@viewhigh.com',
                    userType: 2,
                    companyName: '创意设计部',
                    departmentName: '基础架构部',
                    departmentId: '010101',
                    state: 1,
                    createTime: '2018-06-18',
                    lastLogin: '2018-6-20 20:50',
                    editUser: true,
                    resetPassword: true,
                    setRoleForUser: true,
                },
            ],
            desc: '成功',
            page: {
                curpage: 2,
                pageCounts: 3,
                size: 10,
                totalRecs: 25,
            },
            resultCode: 1000,
        });
    },
    'POST /api/saas/company/all-company': (req, res) => {  //获取单位id
        res.send({
            resultCode: 1000,
            data: [{
                companyId: '1',
                companyName: '公司ID1',
            },
            {
                companyId: '2',
                companyName: '公司ID2',
            },
            {
                companyId: '3',
                companyName: '公司ID3',
            },
            ],
        });
    },
    'GET /api/saas/role/all': (req, res) => { //获取所有角色
        res.send({
            resultCode: 1000,
            data: [
                { 'roleId': '12343441', 'roleName': '角色1角色1角色1', 'roleType': 2 },
                { 'roleId': '12343442', 'roleName': '角色1角色1角色1', 'roleType': 2 },
                { 'roleId': '12343443', 'roleName': '角色1', 'roleType': 2 },
                { 'roleId': '12343444', 'roleName': '角色1角色1', 'roleType': 2 },
                { 'roleId': '12343445', 'roleName': '角色1', 'roleType': 2 },
                { 'roleId': '12343446', 'roleName': 'ksjfksjdk', 'roleType': 2 },
                { 'roleId': '12343447', 'roleName': '角jkdjk色1', 'roleType': 2 },
                { 'roleId': '12343448', 'roleName': '角色2', 'roleType': 2 },
            ],
            desc: '成功',
        });
    },
    'POST /api/saas/user/role2user': (req, res) => { // 给用户分配角色
        res.send({
            resultCode: 1000,
        });
    },
    'GET /api/saas/company/department-tree': (req, res) => { //获取部门树
        res.send({
            resultCode: 1000,
            data: [
                {
                    'value': '01',
                    'label': '技术创新中心01',
                    'children': [{ 'value': '01', 'label': '基础架构部0101' }, { 'value': '02', 'label': '基础架构部0102' }],
                },
                {
                    'value': '02',
                    'label': '技术创新中心02',
                    'children': [{ 'value': '01', 'label': '基础架构部0201' }, { 'value': '02', 'label': '基础架构部0202' }],
                },
            ],
        });
    },
    // 'POST /api/get-init': (req, res) => {
    //   res.send({ resultCode:"1000", statusNum:"1" });
    // },
    'POST /api/saas/role/page': (req, res) => { // 获取角色分页
        res.send({
            'data': [
                {
                    'roleId': '1212',
                    'roleName': '角色1',
                    'roleType': 1,
                }, {
                    'roleId': '1213',
                    'roleName': '角色2',
                    'roleType': 2,
                }, {
                    'roleId': '1214',
                    'roleName': '角色3',
                    'roleType': 3,
                }, {
                    'roleId': '1215',
                    'roleName': '角色4',
                    'roleType': 2,
                }, {
                    'roleId': '1216',
                    'roleName': '角色5',
                    'roleType': 1,
                }, {
                    'roleId': '1217',
                    'roleName': '角色6',
                    'roleType': 3,
                }, {
                    'roleId': '1211',
                    'roleName': '角色7',
                    'roleType': 2,
                },
            ],
            'desc': '成功',
            'page': {
                'curpage': 1,
                'pageCounts': 2,
                'size': 5,
                'totalRecs': 7,
            },
            'resultCode': 1000,
        });
    },
    'POST /api/saas/role/create': (req, res) => { // 新增角色
        res.send({
            resultCode: 1000,
        });
    },
    'POST /api/saas/role/delete': (req, res) => { // 删除角色
        res.send({
            resultCode: 1000,
        });
    },
    'POST /api/saas/role/update': (req, res) => { // 修改角色
        res.send({
            resultCode: 1000,
        });
    },
    'GET /api/saas/permission/tree': (req, res) => { //获取权限树
        res.send({
            'data': {
                'defaultSelectedKeys': [
                    '123',
                    '124',
                    '125',
                    '126',
                    '138',
                    '142',
                    '129',
                    '140',
                    '130',
                ],
                'treeNode': {
                    'chiNodes': [
                        {
                            'chiNodes': [
                                {
                                    'chiNodes': [
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/user/add',
                                            'icon': '新增用户',
                                            'key': '129',
                                            'leaf': true,
                                            'tag': 'das',
                                            'title': '新增用户',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/user/update',
                                            'icon': '修改用户',
                                            'key': '130',
                                            'leaf': true,
                                            'title': '修改用户',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/user/delete',
                                            'icon': '删除用户',
                                            'key': '131',
                                            'leaf': true,
                                            'title': '删除用户',
                                        },
                                    ],
                                    'grade': 4,
                                    'href': 'user',
                                    'key': '126',
                                    'leaf': false,
                                    'title': '用户管理',
                                },
                                {
                                    'chiNodes': [
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/role/add',
                                            'key': '132',
                                            'leaf': true,
                                            'title': '新增角色',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/role/update',
                                            'key': '133',
                                            'leaf': true,
                                            'title': '修改角色',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/role/delete',
                                            'key': '134',
                                            'leaf': true,
                                            'title': '删除角色',
                                        },
                                    ],
                                    'grade': 1,
                                    'href': 'role',
                                    'key': '127',
                                    'leaf': false,
                                    'title': '角色管理',
                                },
                                {
                                    'chiNodes': [
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/permission/add',
                                            'key': '135',
                                            'leaf': true,
                                            'title': '新增权限',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/permission/update',
                                            'key': '136',
                                            'leaf': true,
                                            'title': '修改权限',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/permission/delete',
                                            'key': '137',
                                            'leaf': true,
                                            'title': '删除权限',
                                        },
                                    ],
                                    'grade': 1,
                                    'href': 'permission',
                                    'key': '128',
                                    'leaf': false,
                                    'title': '权限管理',
                                },
                            ],
                            'grade': 1,
                            'href': 'platform',
                            'icon': '平台',
                            'key': '123',
                            'leaf': false,
                            'tag': '22',
                            'title': '平台管理',
                        },
                        {
                            'chiNodes': [
                                {
                                    'chiNodes': [
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/Publish/application',
                                            'icon': 'female',
                                            'key': '140',
                                            'leaf': true,
                                            'tag': 'asda',
                                            'title': '发布应用',
                                        },
                                        {
                                            'chiNodes': [],
                                            'grade': 1,
                                            'href': '/update/application',
                                            'key': '141',
                                            'leaf': true,
                                            'title': '修改应用',
                                        },
                                    ],
                                    'grade': 1,
                                    'href': 'application',
                                    'key': '138',
                                    'leaf': false,
                                    'title': '应用管理',
                                },
                                {
                                    'chiNodes': [],
                                    'grade': 1,
                                    'href': 'source',
                                    'key': '139',
                                    'leaf': true,
                                    'title': '资源管理',
                                },
                            ],
                            'grade': 1,
                            'href': '/Publish',
                            'icon': 'male',
                            'key': '124',
                            'leaf': false,
                            'tag': '11',
                            'title': '发布管理',
                        },
                        {
                            'chiNodes': [
                                {
                                    'chiNodes': [],
                                    'grade': 1,
                                    'href': 'service_order',
                                    'key': '142',
                                    'leaf': true,
                                    'title': '订单管理',
                                },
                                {
                                    'chiNodes': [],
                                    'grade': 1,
                                    'href': '/applay',
                                    'key': '143',
                                    'leaf': true,
                                    'title': '续费管理',
                                },
                                {
                                    'chiNodes': [],
                                    'grade': 1,
                                    'href': '/income',
                                    'key': '144',
                                    'leaf': true,
                                    'title': '收支管理',
                                },
                                {
                                    'chiNodes': [],
                                    'grade': 1,
                                    'href': 'www.viewhigh.com',
                                    'key': '402889b6646331370164633151030000',
                                    'leaf': true,
                                    'title': 'test0.340001761607174',
                                },
                            ],
                            'grade': 3,
                            'href': 'order',
                            'icon': '订购',
                            'key': '125',
                            'leaf': false,
                            'tag': 'cc',
                            'title': '订购管理',
                        },
                    ],
                    'grade': 0,
                    'key': '-1',
                    'leaf': false,
                    'title': 'root',
                },
            },
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/role/permis2role': (req, res) => { // 给角色设置权限
        res.send({
            resultCode: 1000,
        });
    },
    'GET /api/saas/permission/menu-tree': (req, res) => { // 获取控制台菜单列表
        res.send({
            'data': {
                'children': [
                    {
                        'icon': '-jiaoseguanli',
                        'key': '123',
                        'leaf': true,
                        'name': '平台管理',
                        'path': 'manage',
                        'children': [
                            {
                                'name': '用户管理',
                                'path': 'manage-user',
                            },
                            {
                                'name': '角色管理',
                                'path': 'manage-role',
                            },
                            {
                                'name': '权限管理',
                                'path': 'manage-authority',
                            },
                            {
                                'name': '日志管理',
                                'path': 'manage-log',
                            },
                            {
                                'name': '消息管理',
                                'path': 'manage-message',
                            },
                        ],
                    },
                    {
                        'key': '124',
                        'leaf': true,
                        'name': '发布管理',
                        'icon': '-Publish',
                        'path': 'publish',
                        children: [
                            {
                                name: '应用管理',
                                path: 'basic-form',
                            },
                            {
                                name: '资源管理',
                                path: 'step-form',
                            },
                            {
                                name: '告警管理',
                                path: 'advanced-form',
                            },
                            {
                                name: '文档管理',
                                path: 'step-form',
                            },
                            {
                                name: '案例管理',
                                path: 'advanced-form',
                            },
                        ],
                    },
                    {
                        'key': '124',
                        'leaf': true,
                        name: '订购管理',
                        icon: '-kujialeqiyezhan_yijianshengchengpeijian',
                        path: 'oes',
                        children: [
                            {
                                name: '订单管理',
                                path: 'basic-form',
                            },
                            {
                                name: '应用状态管理',
                                path: 'step-form',
                            },
                            {
                                name: '续费管理',
                                path: 'advanced-form',
                            }, {
                                name: '收支管理',
                                path: 'step-form',
                            },
                            {
                                name: '工单管理',
                                path: 'advanced-form',
                            },
                        ],
                    },
                ],
                'key': '-1',
                'leaf': false,
                'name': 'root',
            },
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'GET /api/saas/notice/total': (req, res) => { // 获取未读信息数量
        res.send({
            'data': '1',
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/dict/query-dict-bymodel': (req, res) => { // 日志/消息管理-获取模块下拉list
        res.send({
            'data': [
                {
                    'dictId': '40288a57638c34c601638c4eadaf0000',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '系统管理',
                    'valueIndex': 1000,
                },
                {
                    'dictId': '40288a57638c34c601638c4eadc10001',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '发布管理',
                    'valueIndex': 1100,
                },
                {
                    'dictId': '40288a57638c34c601638c4eadc10002',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '计费管理',
                    'valueIndex': 1200,
                },
                {
                    'dictId': '40288a57638c34c601638c4eadc10003',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '工单统管理',
                    'valueIndex': 1300,
                },
                {
                    'dictId': '40288a57638c34c601638c4eadc10004',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '日志管理',
                    'valueIndex': 1400,
                },
                {
                    'dictId': '40288a57638c34c601638c4eadc10005',
                    'tabColumn': 'model',
                    'tabName': 'td_saas_log',
                    'valueContent': '消息管理',
                    'valueIndex': 1500,
                },
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/log/page': (req, res) => { // 日志管理-分页获取日志信息
        res.send({
            'data': [
                {
                    'userId': '1',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': '2018-06-20 17:38:15',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 3,
                },
                {
                    'userId': '2',
                    'modelName': '系统管理',
                    'subModelName': '文档管理',
                    'createTime': '2018-06-20 17:38:15',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 2,
                    'operationName': 1,
                },
                {
                    'userId': '3',
                    'modelName': '系统管理',
                    'subModelName': '日志管理',
                    'createTime': '2018-06-20 17:38:15',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 2,
                },
                {
                    'userId': '4',
                    'modelName': '系统管理',
                    'subModelName': '权限色管理',
                    'createTime': '2018-06-20 17:38:15',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 4,
                },
                {
                    'userId': '5',
                    'modelName': '系统管理',
                    'subModelName': '订购管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 5,
                },
                {
                    'userId': '6',
                    'modelName': '系统管理',
                    'subModelName': '消息管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 6,
                },
                {
                    'userId': '7',
                    'modelName': '系统管理',
                    'subModelName': '系统配置',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 7,
                },
                {
                    'userId': '8',
                    'modelName': '系统管理',
                    'subModelName': '系统字典表管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 2,
                    'operationName': 8,
                },
                {
                    'userId': '9',
                    'modelName': '系统管理',
                    'subModelName': '计费管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 9,
                },
                {
                    'userId': '10',
                    'modelName': '系统管理',
                    'subModelName': '文件管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 1,
                    'operationName': 10,
                },
                {
                    'userId': '11',
                    'modelName': '系统管理',
                    'subModelName': '文件管理',
                    'createTime': '2018-06-20 17:38:12',
                    'message': '查询系统设置表所有记录',
                    'userName': '李四',
                    'resultName': 2,
                    'operationName': 11,
                },
            ],
            'desc': '成功',
            'page': {
                'curpage': 2,
                'pageCounts': 6,
                'size': 5,
                'totalRecs': 26,
            },
            'resultCode': 1000,
        });
    },
    'POST /api/saas/dict/query-dict-bysubmodel': (req, res) => { // 日志/消息管理-获取子模块下拉list
        res.send({
            'data': [
                {
                    'dictId': '40288a57638c34c601638c52d44f000e',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '用户管理',
                    'valueIndex': 1001,
                },
                {
                    'dictId': '40288a57638c34c601638c52d450000f',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '角色管理',
                    'valueIndex': 1002,
                },
                {
                    'dictId': '40288a57638c34c601638c52d4500010',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '权限管理',
                    'valueIndex': 1003,
                },
                {
                    'dictId': '40288a57638c34c601638c52d4500011',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '系统字典表管理',
                    'valueIndex': 1004,
                },
                {
                    'dictId': '40288a57638c34c601638c52d4500020',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '上传文件管理',
                    'valueIndex': 1005,
                },
                {
                    'dictId': '40288a57638c34c601638c52d4520019',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '文件管理',
                    'valueIndex': 1007,
                },
                {
                    'dictId': '40288a57638c34c601638c52d44f0009',
                    'tabColumn': 'sub_model',
                    'tabName': 'td_saas_log',
                    'valueContent': '系统配置',
                    'valueIndex': 1006,
                },
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/notice/page': (req, res) => { // 消息管理-分页获取消息信息
        res.send({
            'data': [
                {
                    'notice_id': '111111111',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '肯德基放大镜看价格',
                    'result': 0,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111112',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '法规和恢复规划法规和',
                    'result': 1,
                    "messageType": 2,
                    "severity": 3,
                }, {
                    'notice_id': '111111113',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '水电费水电费',
                    'result': 0,
                    "messageType": 3,
                    "severity": 2,
                }, {
                    'notice_id': '111111114',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '水电费水电费是',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111115',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '干活干活干活',
                    'result': 0,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111116',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '法国恢复的股份',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111117',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '水电费水电费是',
                    'result': 0,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111118',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '更好更符合法规',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111119',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '法规的风格的',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111120',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '更符合法规和法国',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '1111111102',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '查询系统设置表所有记录',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '1111111112',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '电饭锅电饭锅的',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '11111111121',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '好几个号集合管',
                    'result': 0,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '11111111211',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '所说的防晒霜的第三代',
                    'result': 1,
                    "messageType": 1,
                    "severity": 1,
                }, {
                    'notice_id': '111111111112',
                    'modelName': '系统管理',
                    'subModelName': '产品管理',
                    'createTime': 1531797381000,
                    'message': '规划局规划局规划局',
                    'result': 0,
                    "messageType": 1,
                    "severity": 1,
                },
            ],
            'desc': '成功',
            'page': {
                'curpage': 2,
                'pageCounts': 6,
                'size': 5,
                'totalRecs': 26,
            },
            'resultCode': 1000,
        });
    },
    'POST /api/saas/user/send-email': (req, res) => { // 发送邮件找回密码
        res.send({
            resultCode: 1000,
        });
    },
    'POST /api/saas/notice/update-read': (req, res) => { // 信息更改为已读
        res.send({
            resultCode: 1000,
        });
    },
    'GET /api/saas/notice/query': (req, res) => { // 查询信息
        res.send({
            'data': {
                'result': 0,
                'modelName': '系统管理',
                'subModelName': '系统配置',
                'createTime': 1531797381000,
                'message': '测试2',
                'notice_id': '111111112',
                'opinion': 'qqqq',
            },
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/notice/update': (req, res) => { // 更新信息
        res.send({
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'GET /api/notices': getNotices,
    'GET /api/500': (req, res) => {
        res.status(500).send({
            timestamp: 1513932555104,
            status: 500,
            error: 'error',
            message: 'error',
            path: '/base/category/list',
        });
    },
    'GET /api/404': (req, res) => {
        res.status(404).send({
            timestamp: 1513932643431,
            status: 404,
            error: 'Not Found',
            message: 'No message available',
            path: '/base/category/list/2121212',
        });
    },
    'GET /api/403': (req, res) => {
        res.status(403).send({
            timestamp: 1513932555104,
            status: 403,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
    'GET /api/401': (req, res) => {
        res.status(401).send({
            timestamp: 1513932555104,
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
        });
    },
    //获取订单
    'POST /api/saas/order/page': (req, res) => {
        res.send({
            'data': [{
                key: '1',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: 1,

            }, {
                key: '2',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: 2,

            }, {
                key: '3',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: 3,

            }, {
                key: '4',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: 4,

            }, {
                key: '5',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: 5,

            }],
            'desc': '成功',
            'page': {
                'curpage': 3,
                'pageCounts': 2,
                'size': 5,
                'totalRecs': 7,
            },
            'resultCode': 1000,
        });
    },
    'POST /api/saas/file/upload': (req, res) => {
        res.send({
            'data': [{
                key: '1',
                appName: 'John Brown',
                userDomainName: 32,
                vhDomainName: 'New York No. 1 Lake Park',
                buyYears: '购买时长',
                totalPrice: '订单总价',
                expireTime: 1688982326314,
                clientId: '客户端',
                clientSecret: '客户端密钥',
                state: '未支付',

            }],
            'desc': '成功',
            'resultCode': 1000,
        });
    },


    'POST /api/saas/searchApply': (req, res) => { // 续费管理-分页查询
        res.send({
            "data": [
                {
                    "appId": "111111111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "111111112",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "111111113",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111111411",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111111511",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111161111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111118111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111110111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1112111111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111131111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "11111117711",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "11116611111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                }, {
                    "appId": "1111411111",
                    "appName": "系统管理",
                    "bookTime": 1531797381000,
                    "cutOffTime": 1531797381000,
                },
            ],
            "desc": "成功",
            "page": {
                "curpage": 2,
                "pageCounts": 6,
                "size": 5,
                "totalRecs": 26
            },
            "resultCode": 1000
        });
    },
    'POST /api/saas/renew': (req, res) => { // 续费管理-续费
        res.send({
            "desc": "成功",
            "resultCode": 1000,
        });
    },
    'GET /api/saas/queryApply': (req, res) => { // 续费管理-查询续费信息
        res.send({
            "desc": "成功",
            "resultCode": 1000,
            "data": {
                "appId": "111111111",
                "appName": "系统管理",
                "bookTime": 1531797381000,
                "cutOffTime": 1531797381000,
                "userDomainName": "外网域名",
                "outerIp": "xxxxx.com",
                "vhDomainName": "访问域名",
                "unitPrice": "2000",
            },
        });
    },
    'GET /api/saas/permission/button': (req, res) => { // 按钮权限
        res.send({
            "desc": "成功",
            "resultCode": 1000,
            "returnType": "authorityTags",
            "data": [
                "role-add",
                "role-delete",
                "user-add",
                "user-delete",
                "document-add",
                "document-delete"
            ],
        });
    },

    'POST /api/saas/application/page': (req, res) => { //分页查询产品信息
        res.send({
            "data": [
                {
                    "stateName": "审核通过",
                    "appName": "SAAS平台",
                    "appId": "402889cb6436153e0164361553670003",
                    "appDescription": "saas平台用于应用发布，用户订阅，用户安全中心",
                    "appShortName": "SAAS",
                    "logoPath": "http://company.zhaopin.com/CompanyLogo/20170224/C7019050722EE5E638E9EB29BAA41834.jpg",
                    "state": 2,
                    "versionName": "0.0.4"
                },
                {
                    "stateName": "审核通过",
                    "appName": "OES平台",
                    "appId": "402889cb643a0d7201643a0d86a00000",
                    "appDescription": "OES平台用于.......",
                    "appShortName": "OES",
                    "logoPath": "http://images.gitbook.cn/1a77dce0-5760-11e8-8023-41215de53e1b",
                    "state": 2,
                    "versionName": "0.0.4"
                }
            ],
            "desc": "成功",
            "page": {
                "curpage": 1,
                "pageCounts": 1,
                "size": 10,
                "totalRecs": 2
            },
            "resultCode": 1000
        });
    },
    'POST /api/saas/application/create': (req, res) => { //新增产品信息
        res.send({
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'POST /api/saas/document/page': (req, res) => { //分页查询文档信息
        res.send({
            "data": [
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f70001",
                    "documentName": "sso-prodksdfksjdfisjdfkjskfjksdjfk.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb0000",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f70002",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb0003",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f70004",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb0005",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f70006",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb0007",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip",
                    'createTime': 1531797381000,
                },
            ],
            "desc": "成功",
            "page": {
                "curpage": 1,
                "pageCounts": 1,
                "size": 10,
                "totalRecs": 2
            },
            "resultCode": 1000
        });
    },
    'POST /api/saas/document/delete': (req, res) => { //删除文档信息
        res.send({
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/user/query-users-mail': (req, res) => { //产品管理-模糊匹配查询用户信息（所属部门）
        res.send({
            "desc": "成功",
            "resultCode": 1000,
            "data": [
                {
                    "user_phone": "1212111111",
                    "user_mail": "mail@123.com",
                    "user_type": 1,
                    "user_id": "1d24524545454545454541",
                    "department_id": "25555888dddssfs",
                    "department_name": "基础架构部1",
                },
                {
                    "user_phone": "15454545454",
                    "user_mail": "mailuieur@163.com",
                    "user_type": 2,
                    "user_id": "1d24524545454545454542",
                    "department_id": "25555888dddssfsdfd",
                    "department_name": "基础架构部2",
                },
            ],
        });
    },
    'GET /api/saas/application/query-my-app': (req, res) => { //文档管理-获取登录用户产品列表
        res.send({
            "data": [
                {
                    "appDescription": "单点登录服务于saas平台的业务系统用户中心，与统一登录",
                    "appId": "40287c5464f898030164f8b1121e0001",
                    "appName": "单点登录",
                    "appShortName": "SSO",
                    "departmentId": "402889b663fd4d6b0163fd57453a1000",
                    "detailPageFile": {
                        "fileId": "ff80808164f876ce0164f8b116e80004",
                        "fileName": "index.html",
                        "fileSize": 4939,
                        "fileSuffix": "html",
                        "path": "product/develop/SSO/introduce/index.html"
                    },
                    "detailPageFileId": "ff80808164f876ce0164f8b116e80004",
                    "detailPageZipFileId": "ff80808164f876ce0164f8a03e260001",
                    "logoFile": {
                        "fileId": "ff80808164f876ce0164f89f56110000",
                        "fileName": "sso.png",
                        "fileSize": 2471,
                        "fileSuffix": "png",
                        "path": "2018/8/2/7e7da182-5215-40eb-90d2-4b42befdb174.png"
                    },
                    "logoFileId": "ff80808164f876ce0164f89f56110000",
                    "userId": "402889b663fd4d6b0163fd57453a0000"
                },
                {
                    "appDescription": "SAAS平台用于产品发布，租户订购的平台，用户安全中心。",
                    "appId": "402889cb645a122a01645a1242c00003",
                    "appName": "SAAS平台",
                    "appShortName": "SAAS",
                    "departmentId": "0301",
                    "detailPageFileId": "402889cb645a1f4d01645a1f64340005",
                    "detailPageZipFileId": "402889cb6459a432016459a446c80001",
                    "logoFileId": "402889cb6459a432016459a446b50000",
                    "userId": "402889b663fd4d6b0163fd57453a0000"
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/app-version/query-app-version': (req, res) => { //文档管理-获取审核通过的版本信息
        res.send({
            "data": [
                {
                    "adminId": "402889b663fd4d6b0163fd57453a0000",
                    "appId": "40287c5464f898030164fd88a5470047",
                    "configFileId": "ff80808164fe41ad0164fe5093c00000",
                    "createTime": 1533277138526,
                    "customFileId": "ff80808164f876ce0164f8a0692d0003",
                    "deploymentFileId": "ff80808164fe6f520164fe7009a90000",
                    "limitTotal": 20,
                    "reviewDesc": "审核通过",
                    "state": 2,
                    "upgrageTime": 1533277161000,
                    "versionDesc": "初始化版本",
                    "versionId": "40287c5464fe6bbf0164fe706e7b0000",
                    "versionName": "1.0.0",
                    "versionSn": 1
                },
                {
                    "adminId": "402889b663fd4d6b0163fd57453a0000",
                    "appId": "40287c5464f898030164fd88a5470047",
                    "configFileId": "ff80808164fe41ad0164fe5093c00000",
                    "createTime": 1533277138526,
                    "customFileId": "ff80808164f876ce0164f8a0692d0003",
                    "deploymentFileId": "ff80808164fe6f520164fe7009a90000",
                    "limitTotal": 20,
                    "reviewDesc": "审核通过",
                    "state": 2,
                    "upgrageTime": 1533277161000,
                    "versionDesc": "初始化版本",
                    "versionId": "40287c5464fe6bbf0164fe706e7b00001",
                    "versionName": "1.0.1",
                    "versionSn": 1
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },

    'GET /api/saas/dict/list': (req, res) => { //文档管理-查询文档类型字典
        res.send({
            "data": [
                {
                    "dictId": "40288a57638c34c601638c4eadaf0000",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "系统管理",
                    "valueIndex": 1000
                },
                {
                    "dictId": "40288a57638c34c601638c4eadc10001",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "产品管理",
                    "valueIndex": 1100
                },
                {
                    "dictId": "40288a57638c34c601638c4eadc10002",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "计费管理",
                    "valueIndex": 1200
                },
                {
                    "dictId": "40288a57638c34c601638c4eadc10003",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "工单统管理",
                    "valueIndex": 1300
                },
                {
                    "dictId": "40288a57638c34c601638c4eadc10004",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "日志管理",
                    "valueIndex": 1400
                },
                {
                    "dictId": "40288a57638c34c601638c4eadc10005",
                    "tabName": "td_saas_document",
                    "tabColumn": "document_type",
                    "valueContent": "消息管理",
                    "valueIndex": 1500
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/application/all': (req, res) => { //工单管理-获取应用名称列表
        res.send({
            "data": [
                {
                    "appShortName": "SAAS",
                    "appName": "SAAS平台",
                    "appId": "402889cb6436153e0164361553670003",
                    "detailPath": "2018/6/25/6784f4c2-7b2f-4dd0-b2df-ac0245f7f3c8/index.html"
                },
                {
                    "appShortName": "OES",
                    "appName": "OES平台",
                    "appId": "402889cb643a0d7201643a0d86a00000"
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'POST /api/saas/work-order/page': (req, res) => { //工单管理page分页
        res.send({
            "data": [
                {
                    "work_id": "1111111111",
                    "state": 0,
                    "createTime": 1533113578057,
                    "subject": 1,
                    "appName": "SAAS平台"
                },
                {
                    "work_id": "1111111112",
                    "state": 1,
                    "createTime": 1533113578057,
                    "subject": 2,
                    "appName": "SAAS平台"
                },
                {
                    "work_id": "1111111411",
                    "state": 0,
                    "createTime": 1533113578057,
                    "subject": 3,
                    "appName": "SAAS平台"
                },
                {
                    "work_id": "1111113111",
                    "state": 1,
                    "createTime": 1533113578057,
                    "subject": 4,
                    "appName": "SAAS平台"
                },
                {
                    "work_id": "1111111511",
                    "state": 0,
                    "createTime": 1533113578057,
                    "subject": 5,
                    "appName": "SAAS平台"
                },
                {
                    "work_id": "1111171111",
                    "state": 0,
                    "createTime": 1533113578057,
                    "subject": 1,
                    "appName": "SAAS平台"
                },
            ],
            "desc": "成功",
            "page": {
                "curpage": 1,
                "pageCounts": 1,
                "size": 10,
                "totalRecs": 1
            },
            "resultCode": 1000
        });
    },
    'POST /api/saas/work-order/create': (req, res) => { //新建工单
        res.send({
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/work-order/query': (req, res) => { //工单详情
        res.send({
            "data": {
                "appId": "402889cb643a0d7201643a0d86a00000",
                "createTime": 1533113578057,
                "mail": "111",
                "message": "222222",
                "phone": "11",
                "state": 0,
                "subject": 1,
                "subjectStr": "售前",
                "userId": "402889b663fd4d6b0163fd57453a0000",
                "versionId": "111111",
                "workId": "111111111"
            },
            "desc": "成功",
            "resultCode": 1000
        }
        );
    },
    'GET /api/saas/work-order/query-reply': (req, res) => { //查询工单回复详情
        res.send({
            "data": [
                {
                    "createTime": 1533630305000,
                    "isMy": true,
                    "message": "客户了解客户看了就很快乐很快乐就会立刻就会离开了户口老客户了看来很快乐很快乐就很快乐很快乐建行卡赶快来赶快回来给客户老顾客狼号鬼哭狼号鬼哭老顾客了户口管理看来赶快回来给客户老顾客了",
                    "replyId": "111111111",
                    "userId": "402889b663fd4d6b0163fd57453a0000",
                    "workId": "222222222222",
                    "userName": "我"
                },
                {
                    "createTime": 1533633905000,
                    "isMy": true,
                    "message": "开放接口规范开发框架和大家符合大家还记得和发动机的海景房的发动机号附近的防护等级划分接电话积分兑换积分等级划分",
                    "replyId": "222222222222",
                    "userId": "402889b663fd4d6b0163fd57453a0000",
                    "workId": "222222222222",
                    "userName": "我"
                },
                {
                    "createTime": 1533634025000,
                    "isMy": false,
                    "message": "肯定就离开过对方立刻感觉放大来看几个路口的房价高发动机都快来法国进口来的房间观看了的附近开了个",
                    "replyId": "2222222222223333",
                    "userId": "402888146439d9d4016439d9ec2e0000",
                    "workId": "222222222222",
                    "userName": "热狗"
                },
                {
                    "createTime": 1533634025000,
                    "isMy": false,
                    "message": "肯定就离开过对方立刻感觉放大来看几个路口的房价高发动机都快来法国进口来的房间观看了的附近开了个",
                    "replyId": "222222222222333dd3",
                    "userId": "402888146439d9d4016439d9ec2e0000",
                    "workId": "222222222222",
                    "userName": "望海saas管理平台"
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'POST /api/saas/work-order/create-reply': (req, res) => { //新建工单回复
        res.send({
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/sys-setting/all': (req, res) => { // 查询全部系统配置
        res.send({
            "data": [
                {
                    "sysDesc": "是否强制用户首次登录修改密码",
                    "sysId": "3a506646a3a141bfa5540be0d22b8001",
                    "sysIndex": 1,
                    "sysName": "首次登陆是否修改密码",
                    "sysValue": "是"
                },
                {
                    "sysDesc": "用户登录连续几次验证失败直接锁定账号",
                    "sysId": "3a506646a3a141bfa5540be0d22b8004",
                    "sysIndex": 4,
                    "sysName": "密码输入几次后锁定",
                    "sysValue": "4"
                }
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/sys-setting/update': (req, res) => { //修改系统配置
        res.send({
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/sys-setting/query': (req, res) => { // 根据id查询配置信息
        res.send({
            "data": {
                "sysDesc": "会话时间",
                "sysId": "3a506646a3a141bfa5540be0d22b8005",
                "sysIndex": 4,
                "sysJson": "是,否",
                "sysName": "会话时间",
                "sysValue": "是"
            },
            'desc': '成功',
            'resultCode': 1000,
        });
    },

    // 控制台首页
    'POST /api/saas/notice/query-severity-count': (req, res) => { // 查询预警事件信息
        res.send({
            "data": [
                {
                    "severity": 1,
                    "noticeCount": 223
                },
                {
                    "severity": 2,
                    "noticeCount": 2343
                },
                {
                    "severity": 3,
                    "noticeCount": 254
                }
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },

    'GET /api/saas/announcement/query-all': (req, res) => { // 查询公告列表
        res.send({
            "data": [{
                "message": "反馈考国家代理费大哥大法官地方反馈考国家代理费",
                "annId": "3a506646a3a141bfa5540be0d22b80051",
                'createTime': 1531797381000,
            },
            {
                "message": "技感的开领导技感的开领导技感的开领导技感的开领导",
                "annId": "3a506646a3a141bfa5540be0d22b80052",
                'createTime': 1531797381000,
            },
            {
                "message": "好来访客户就好来访客户就好来访客户就好来访客户就好来访客户就",
                "annId": "3a506646a3a141bfa5540be0d22b80053",
                'createTime': 1531797381000,
            },
            {
                "message": "好科技感的看大家好科技感的看大家好科技感的看大家",
                "annId": "3a506646a3a141bfa5540be0d22b80054",
                'createTime': 1531797381000,
            }, {
                "message": "技感的开领导技感的开领导技感的开领导技感的开领导",
                "annId": "3a506646a3a141bfa5540be0d22b80055",
                'createTime': 1531797381000,
            },
            {
                "message": "好来访客户就好来访客户就好来访客户就好来访客户就",
                "annId": "3a506646a3a141bfa5540be0d22b80056",
                'createTime': 1531797381000,
            },
            {
                "message": "好科技感的看大家好科技感的看大家好科技感的看大家好科技感的看大家",
                "annId": "3a506646a3a141bfa5540be0d22b80057",
                'createTime': 1531797381000,
            },
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'POST /api/saas/software/query-product-operation-status': (req, res) => { // 获取产品状态
        res.send({
            "data": [
                {
                    "productState": "0",
                    "productName": "testVH1.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "1",
                    "productName": "testVH.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "0",
                    "productName": "testVH1.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "1",
                    "productName": "testVH.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "0",
                    "productName": "testVH1.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "1",
                    "productName": "testVH.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "0",
                    "productName": "testVH1.sso.viewhigh.com",
                    "token":"2323232323"
                },
                {
                    "productState": "1",
                    "productName": "testVH.sso.viewhigh.com",
                    "token":"2323232323"
                }
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'GET /api/saas/application/query-own-app': (req, res) => { // 获取产品列表
        res.send({
            "data": [
                {
                    "appId": "40287c5464f898030164f8b1121e0001",
                    "appName": "单点登录1",
                    "detailPageFile": {
                        "path": "product/develop/sso/introduce/index.html",
                    },
                    "logoFile": {
                        "path": "2018/8/29/39be0ce0-7dec-44c9-bebc-8dd1e1c6cead.png",
                    },
                },
                {
                    "appId": "40287c5464f898030164f8b1121e0002",
                    "appName": "单点登录2",
                    "detailPageFile": {
                        "path": "product/develop/sso/introduce/index.html",
                    },
                    "logoFile": {
                        "path": "2018/8/29/39be0ce0-7dec-44c9-bebc-8dd1e1c6cead.png",
                    },
                },
                {
                    "appId": "40287c5464f898030164f8b1121e0003",
                    "appName": "单点登录3",
                    "detailPageFile": {
                        "path": "product/develop/sso/introduce/index.html",
                    },
                    "logoFile": {
                        "path": "2018/8/29/39be0ce0-7dec-44c9-bebc-8dd1e1c6cead.png",
                    },
                },
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'GET /api/saas/document/query-home-page': (req, res) => { // 获取产品文档列表
        res.send({
            "data": [
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f70001",
                    "documentName": "sso-pro1212121d.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb0000",
                    "documentName": "sso-prdfgdfgod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                },
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f700011",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb00002",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                },
                {
                    "documentType": 2,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2f700013",
                    "documentName": "sso-prod121212.zip",
                    "documentTypeName": "帮助文档",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                },
                {
                    "documentType": 1,
                    "appName": "SSO单点登录",
                    "documentId": "402889cb64692cec0164692ea2eb00004",
                    "documentName": "sso-prod.zip",
                    "documentTypeName": "用户手册",
                    "versionName": "1.0.0",
                    "documentPath": "2018/7/3/9b6c3e47-f5a5-4c1f-9ba2-c365bc00ead4.zip"
                }
            ],
            'desc': '成功',
            'resultCode': 1000,
        });
    },
    'GET /api/saas/application/query': (req, res) => { //获取单个app应用信息
        res.send({
            "data": {
                "appDescription": "saas平台用于应用发布，用户订阅，用户安全中心saas平台用于应用发布，用户订阅，用户安全中心saas平台用于应用发布，用户订阅，用户安全中心用户安全中心saas平台用于应用发布，用户订阅，用户安全中心",
                "appId": "402889cb6436153e0164361553670003",
                "appName": "SAAS平台",
                "appShortName": "SAAS",
                "departmentId": "402889b663fd4d6b0163fd57453a1000",
                "detailPageFile": {
                    "fileId": "402889cb6436153e0164361553290001",
                    "fileName": "index.html",
                    "fileSize": 291,
                    "fileSuffix": "html",
                    "path": "2018/6/25/6784f4c2-7b2f-4dd0-b2df-ac0245f7f3c8/index.html"
                },
                "detailPageFileId": "402889cb6436153e0164361553290001",
                "detailPageZipFile": {
                    "fileId": "402889cb64360bb50164360bc9e10000",
                    "fileName": "index.zip",
                    "fileSize": 361,
                    "fileSuffix": "zip",
                    "path": "2018/6/25/6784f4c2-7b2f-4dd0-b2df-ac0245f7f3c8.zip"
                },
                "detailPageZipFileId": "402889cb64360bb50164360bc9e10000",
                "logoFile": {
                    "fileId": "402889cb64360b310164360b47940000",
                    "fileName": "saas.png",
                    "fileSize": 335643,
                    "fileSuffix": "png",
                    "path": "2018/6/25/c1367784-8ae4-4b9a-a35a-a411e0fd562b.png"
                },
                "logoFileId": "402889cb64360b310164360b47940000",
                "userId": "402889b663fd4d6b0163fd57453a1000"
            },
            "desc": "成功",
            "resultCode": 1000
        });
    },
    'GET /api/saas/app-case/query-all': (req, res) => { //获取有案例的应用
        res.send({
            "data": [
                {
                    "appCase": [
                        {
                            "caseName": "测试2",
                            "path": "2018/9/3/189264d9-c01b-4814-ac84-b43219a321719.epub"
                        },
                        {
                            "caseName": "测试1",
                            "path": "2018/9/3/189264d9-c01b-4814-ac84-b43219a321729.epub"
                        }
                    ],
                    "appName": "望海saas",
                    "appId": "402889cb645ea8ad01645ea8c38d0003"
                }
            ],
            "desc": "成功",
            "resultCode": 1000
        });
    },

}
// export default (noProxy ? {} : delay(proxy, 1000));


// 测试环境
// export default (noProxy ? {
//     'GET /api/(.*)': 'http://192.168.252.213/api/',
//     'POST /api/(.*)': 'http://192.168.252.213/api/',
// } : delay(proxy, 1000));

// 腾蛟
// export default (noProxy ? {
// 'GET /api/(.*)':'http://192.168.9.54:8089/',
// 'POST /api/(.*)':'http://192.168.9.54:8089/',
// } : delay(proxy, 1000));

// 银宝
// export default (noProxy ? {
//     'GET /api/(.*)': 'http://192.168.8.75:8089/',
//     'POST /api/(.*)': 'http://192.168.8.75:8089/',
// } : delay(proxy, 1000));


// 小克
// export default (noProxy ? {
//     'GET /api/(.*)': 'http://192.168.5.83:8002',
//     'POST /api/(.*)': 'http://192.168.5.83:8002',
// } : delay(proxy, 1000));

// 鹏程
// export default (noProxy ? {
// 'GET /api/(.*)':'http://192.168.7.220:80',
// 'POST /api/(.*)':'http://192.168.7.220:80',
// } : delay(proxy, 1000));

// 白老大
// export default (noProxy ? {
//   'GET /api/(.*)':'http://192.168.5.244:8089',
//   'POST /api/(.*)':'http://192.168.5.244:8089',
// } : delay(proxy, 1000));

// 小明
// export default (noProxy ? {
// 'GET /api/(.*)':'http://192.168.9.75:8089/',
// 'POST /api/(.*)':'http://192.168.9.75:8089/',
// } : delay(proxy, 1000));




import { isUrl } from '../utils/utils';

// const menuData = [
//     {
//         name: '系统管理',
//         icon: '-jiaoseguanli',
//         path: 'manage',
//         children: [
//             {
//                 name: '用户管理',
//                 path: 'manage-user',
//             },
//             {
//                 name: '角色管理',
//                 path: 'manage-role',
//             },
//             {
//                 name: '权限管理',
//                 path: 'manage-authority',
//             }, {
//                 name: '日志管理',
//                 path: 'manage-log',
//             },
//             {
//                 name: '消息管理',
//                 path: 'manage-message',
//             },
//             {
//                 name: '系统配置',
//                 path: 'system-config',
//             },
//         ],
//     },
//     {
//         name: '发布管理',
//         icon: 'form',
//         path: 'publish',
//         children: [
//             {
//                 name: '产品管理',
//                 path: 'manage-product',
//             },
//             {
//                 name: '资源管理',
//                 path: 'manage-resource',
//             },
//             {
//                 name: 'details',
//                 path: 'details',
//                 children:[
//                     {
//                         name: '资源details',
//                         path: 'resource-details',
//                     },
//                     {
//                         name: '产品details',
//                         path: 'product-details',
//                     },
//                 ],
//             },
//             // {
//             //     name: '告警管理',
//             //     path: 'manage-alarm',
//             // },
//             {
//               name: '文档管理',
//               path: 'manage-document',
//             },
//             {
//               name: '案例管理',
//               path: 'manage-case',
//             },
//         ],
//     },
//     {
//         name: '订购管理',
//         icon: 'file-text',
//         path: 'order',
//         children: [
//             {
//                 name: '订单管理',
//                 path: 'manage-order',
//             },
//             {
//                 name: '应用状态管理',
//                 path: 'application-state',
//             },
//             // {
//             //     name: '续费管理',
//             //     path: 'manage-renew',
//             // },
//             {
//                 name: '收支管理',
//                 path: 'income-expenses',
//             },
//             {
//                 name: '工单管理',
//                 path: 'work-list',
//             },
//         ],
//     },

//     {
//         name: '产品',
//         icon: '',
//         path: 'product/',
//         hideInMenu: true,
//         children: [
//             {
//                 name: '产品页',
//                 path: 'index',
//             },
//             {
//                 name: '购买页',
//                 path: 'detail',
//             },
//             {
//                 name: '案例',
//                 path: 'case',
//             },
//         ],
//     },
//     {
//         name: '控制台',
//         icon: '',
//         path: 'console',
//         hideInMenu: true,
//     },
// ];

function formatter(data, parentPath = '/', parentAuthority) {
  return (
    data &&
    data.map(item => {
      let { path } = item;
      if (!isUrl(path)) {
        path = parentPath + item.path;
      }
      const result = {
        ...item,
        path,
        authority: item.authority || parentAuthority,
      };
      if (item.children) {
        result.children = formatter(item.children, `${parentPath}${item.path}`, item.authority);
      }
      return result;
    })
  );
}

function initialMenuData() {
  let menuData = [];
  const menuDataJson = JSON.parse(localStorage.getItem('menuData'));
  if (!!menuDataJson) {
    menuData = menuDataJson.children;
    const details = {
      name: '发布详情',
      path: '/details',
      hideInMenu: true,
      children: [
        {
          name: '资源详情',
          path: '/resource-details',
        },
        {
          name: '版本管理',
          path: '/product-details',
        },
      ],
    };
    menuData.map(item => {
      if (item.name === '发布管理') {
        item.children.push(details);
      }
    });
  }
  return menuData;
}

// export const getMenuData = () => formatter(menuData);
export const getMenuData = () => formatter(initialMenuData());

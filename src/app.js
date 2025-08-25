import { message } from 'antd';
import AdminController from './services/admin';

export async function getInitialState() {
  if (location.pathname === '/login') {
    // 强行跳登录页
    const token = localStorage.getItem('adminToken');

    if (token) {
      // 处于已经登录状态
      const result = await AdminController.getInfo();
      if (result.data) {
        // 有 token 并且有效
        history.go(-1);
        message.warning('请先退出后再登录');
      }
    }
  } else {
    // 强行跳内部页面
    const result = await AdminController.getInfo();
    if (result.data) {
      // 有 token 并且有效
      const { data } = await AdminController.getAdminById(result.data._id);
      return {
        name: data.nickname,
        avatar: data.avatar,
        adminInfo: data,
      };
    } else {
      // token 过期或没有 token
      localStorage.removeItem('adminToken');
      location.href = '/login';
      message.warning('登录过期，请重新登录');
    }
  }
}

export const layout = () => {
  return {
    logo: 'https://img0.baidu.com/it/u=2775864987,1125109803&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=463',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('adminToken');
      location.href = '/login';
      message.success('退出登录成功');
    },
  };
};

export const request = {
  timeout: 3000,
  requestInterceptors: [
    function (url, options) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
      }
      return { url, options };
    },
  ],
};

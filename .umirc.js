// 使用的是配置式路由
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'coderstation',
    pure: true,
    loading: true,
  },
  dva: {}, // 打开 dva 插件
  routes: [
    {
      path: '/',
      redirect: '/home',
      access: 'NormalAdmin',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      icon: 'HomeOutlined',
      access: 'NormalAdmin',
    },
    {
      name: '管理员',
      path: '/admin',
      icon: 'UserOutlined',
      access: 'SuperAdmin',
      routes: [
        {
          name: '管理员列表',
          path: 'adminList',
          component: './Admin',
          access: 'SuperAdmin',
        },
        {
          name: '添加管理员',
          path: 'addAdmin',
          component: './Admin/addAdmin',
          access: 'SuperAdmin',
        },
      ],
    },
    {
      name: '用户',
      path: '/user',
      icon: 'TeamOutlined',
      access: 'NormalAdmin',
      routes: [
        {
          name: '用户列表',
          path: 'userlist',
          component: './User',
          access: 'NormalAdmin',
        },
        {
          name: '添加用户',
          path: 'adduser',
          component: './User/addUser',
          access: 'NormalAdmin',
        },
        {
          name: '编辑用户',
          path: 'editUser/:id',
          component: './User/editUser',
          hideInMenu: true,
          access: 'NormalAdmin',
        },
      ],
    },
    {
      name: '书籍',
      path: '/book',
      icon: 'ReadOutlined',
      access: 'NormalAdmin',
      routes: [
        {
          name: '书籍列表',
          path: 'bookList',
          component: './Book',
          access: 'NormalAdmin',
        },
        {
          name: '添加书籍',
          path: 'addBook',
          component: './Book/addBook',
          access: 'NormalAdmin',
        },
        {
          name: '编辑书籍',
          path: 'editBook/:id',
          component: './Book/editBook',
          hideInMenu: true,
          access: 'NormalAdmin',
        },
      ],
    },
    {
      name: '面试题',
      path: '/interview',
      icon: 'SignatureOutlined',
      access: 'NormalAdmin',
      routes: [
        {
          name: '面试题列表',
          path: 'interviewList',
          component: './Interview',
          access: 'NormalAdmin',
        },
        {
          name: '面试题列表',
          path: 'interviewList/:id',
          component: './Interview/interviewDetail',
          hideInMenu: true,
          access: 'NormalAdmin',
        },
        {
          name: '添加面试题',
          path: 'addInterview',
          component: './Interview/addInterview',
          access: 'NormalAdmin',
        },
        {
          name: '编辑面试题',
          path: 'editInterview/:id',
          component: './Interview/editInterview',
          hideInMenu: true,
          access: 'NormalAdmin',
        },
      ],
    },
    {
      name: '问答',
      path: '/issue',
      component: './Issue',
      icon: 'ProfileOutlined',
      access: 'NormalAdmin',
    },
    {
      name: '问答详情',
      path: '/issue/:id',
      component: './Issue/issueDetail',
      hideInMenu: true,
      access: 'NormalAdmin',
    },
    {
      name: '评论',
      path: '/comment',
      component: './Comment',
      icon: 'CalendarOutlined',
      access: 'NormalAdmin',
    },
    {
      name: '类型',
      path: '/type',
      component: './Type',
      icon: 'AppstoreOutlined',
      access: 'NormalAdmin',
    },
    {
      path: '/login',
      component: './Login',
      menuRender: false,
    },
  ],
  proxy: {
    // 代理转发配置
    '/api': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
    '/static': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
    '/res': {
      target: 'http://127.0.0.1:7001',
      changeOrigin: true,
    },
  },
  npmClient: 'npm',
});

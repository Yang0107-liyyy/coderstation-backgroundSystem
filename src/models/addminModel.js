import AdminController from '@/services/admin';

export default {
  // 命名空间
  namespace: 'admin',
  // 数据仓库
  state: {
    adminList: [], // 存储所有管理员数据
  },
  // 同步更新数据仓库状态
  reducers: {
    // 初始化管理员列表
    initAdminList(state, { payload }) {
      const newState = { ...state };
      newState.adminList = payload;
      return newState;
    },
    // 删除管理员
    deleteAdmin(state, { payload }) {
      const newState = { ...state };
      // 找到要删除的那条的下标
      const index = newState.adminList.indexOf(payload);
      const arr = [...newState.adminList];
      arr.splice(index, 1);
      newState.adminList = arr;
      return newState;
    },
    // 更新管理员信息
    updateAdmin(state, { payload }) {
      const newState = { ...state };
      for (let i = 0; i < newState.adminList.length; i++) {
        if (newState.adminList[i]._id === payload.adminInfo._id) {
          for (let key in payload.newAdminInfo) {
            if (payload.newAdminInfo.hasOwnProperty(key)) {
              newState.adminList[i][key] = payload.newAdminInfo[key];
            }
          }
          break;
        }
      }
      return newState;
    },
    // 新增管理员
    addAdmin(state, { payload }) {
      const newState = { ...state };
      const arr = [...newState.adminList];
      arr.push(payload);
      newState.adminList = arr;
      return newState;
    },
  },
  // 异步处理副作用
  effects: {
    // 初始化管理员列表
    *_initAdminList(_, { put, call }) {
      // 和服务器通信，拿到所以数据
      const { data } = yield call(AdminController.getAdmin);
      // 调用reducer更新本地仓库数据
      yield put({
        type: 'initAdminList',
        payload: data,
      });
    },
    // 删除管理员
    *_deleteAdmin({ payload }, { put, call }) {
      // 删除服务器端的管理员数据
      yield call(AdminController.deleteAdmin, payload._id);
      // 更新本地仓库
      yield put({
        type: 'deleteAdmin',
        payload,
      });
    },
    // 更新管理员信息
    *_editAdmin({ payload }, { put, call }) {
      yield call(
        AdminController.editAdmin,
        payload.adminInfo._id,
        payload.newAdminInfo,
      );
      yield put({
        type: 'updateAdmin',
        payload,
      });
    },
    // 新增管理员
    *_addAdmin({ payload }, { put, call }) {
      const { data } = yield call(AdminController.addAdmin, payload);
      yield put({
        type: 'addAdmin',
        payload: data,
      });
    },
  },
};

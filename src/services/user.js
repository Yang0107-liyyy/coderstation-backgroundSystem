import { request } from 'umi';

// 分页获取用户信息
function getUserByPage(params) {
  return request('/api/user', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 根据用户 id 获取用户详情
function getUserById(userId) {
  return request(`/api/user/${userId}`, {
    method: 'GET',
  });
}

// 根据 id 修改用户
function editUser(userId, newUserInfo) {
  return request(`/api/user/${userId}`, {
    method: 'PATCH',
    data: newUserInfo,
  });
}

// 根据 id 删除用户
function deleteUser(userId) {
  return request(`/api/user/${userId}`, {
    method: 'DELETE',
  });
}

// 新增用户
function addUser(newUserInfo) {
  newUserInfo.type = 'background';
  return request('/api/user', {
    method: 'POST',
    data: newUserInfo,
  });
}

export default {
  getUserByPage,
  getUserById,
  editUser,
  deleteUser,
  addUser,
};

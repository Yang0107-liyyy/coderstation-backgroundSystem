import { request } from 'umi';

// 根据分页获取面试题
function getInterviewByPage(params) {
  return request('/api/interview', {
    method: 'GET',
    params: { ...params },
  });
}

// 根据 id 获取面试题
function getInterviewById(interviewId) {
  return request(`/api/interview/${interviewId}`, {
    method: 'GET',
  });
}

// 编辑面试题
function editInterview(interviewId, newInterviewInfo) {
  return request(`/api/interview/${interviewId}`, {
    method: 'PATCH',
    data: newInterviewInfo,
  });
}

// 删除面试题
function deleteInterview(interviewId) {
  return request(`/api/interview/${interviewId}`, {
    method: 'DELETE',
  });
}

// 新增面试题
function addInterview(newInterviewInfo) {
  return request('/api/interview', {
    method: 'POST',
    data: newInterviewInfo,
  });
}

export default {
  getInterviewByPage,
  getInterviewById,
  editInterview,
  deleteInterview,
  addInterview,
};

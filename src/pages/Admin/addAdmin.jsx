import { PageContainer } from '@ant-design/pro-components';
import { useDispatch, useNavigate, useSelector } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import AdminForm from './components/adminForm';

function AddAdmin(props) {
  const [newAdminInfo, setNewAdminInfo] = useState({
    loginId: '',
    loginPwd: '',
    nickname: '',
    avatar: '',
    permission: 2, // 默认是普通管理员
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminList } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!adminList.length) {
      dispatch({
        type: 'admin/_initAdminList',
      });
    }
  }, [adminList]);

  function submitHandle() {
    dispatch({
      type: 'admin/_addAdmin',
      payload: newAdminInfo,
    });
    message.success('添加管理员成功');
    navigate('/admin/adminList');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: '500px' }}>
        <AdminForm
          type="add"
          adminInfo={newAdminInfo}
          setAdminInfo={setNewAdminInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default AddAdmin;

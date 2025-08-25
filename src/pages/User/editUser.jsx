import UserController from '@/services/user';
import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from './components/userForm';

function EditUser(props) {
  const [userInfo, setUserInfo] = useState(null);
  // 得到要编辑的用户的id
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const { data } = await UserController.getUserById(id);
      setUserInfo(data);
    }
    fetchData();
  }, []);

  function submitHandle() {
    UserController.editUser(userInfo._id, userInfo);
    message.success('信息修改成功');
    navigate('/user/userList');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 800 }}>
        <UserForm
          type="edit"
          submitHandle={submitHandle}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      </div>
    </PageContainer>
  );
}

export default EditUser;

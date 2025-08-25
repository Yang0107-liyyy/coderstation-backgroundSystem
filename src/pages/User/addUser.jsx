import UserController from '@/services/user';
import { PageContainer } from '@ant-design/pro-components';
import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForem from './components/userForm';

function AddUser(props) {
  const navigate = useNavigate();

  const [newUserInfo, setNewUserInfo] = useState({
    loginId: '',
    loginPwd: '',
    avatar: '',
    nickname: '',
    mail: '',
    qq: '',
    wechat: '',
    intro: '',
  });

  function submitHandle() {
    UserController.addUser(newUserInfo);
    navigate('/user/userList');
    message.success('添加用户成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 800 }}>
        <UserForem
          type="add"
          submitHandle={submitHandle}
          userInfo={newUserInfo}
          setUserInfo={setNewUserInfo}
        />
      </div>
    </PageContainer>
  );
}

export default AddUser;

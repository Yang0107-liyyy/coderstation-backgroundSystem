import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Upload } from 'antd';
import { useEffect, useRef } from 'react';

function UserForm({ type, submitHandle, userInfo, setUserInfo }) {
  // 回填表单
  const formRef = useRef();
  useEffect(() => {
    if (formRef.current) {
      formRef.current.setFieldsValue(userInfo);
    }
  }, [userInfo]);

  // 根据用户填写内容实时更新表单的用户信息
  function updataInfo(newInfo, key) {
    const newUserInfo = { ...userInfo };
    if (typeof newInfo === 'string') {
      newUserInfo[key] = newInfo.trim();
    } else {
      newUserInfo[key] = newInfo;
    }
    setUserInfo(newUserInfo);
  }

  // 当前头像
  let avatarPreview = null;
  if (type === 'edit') {
    avatarPreview = (
      <Form.Item label="当前头像" name="avatarPreview">
        <Image src={userInfo?.avatar} width={100} />
      </Form.Item>
    );
  }

  return (
    <Form
      name="basic"
      initialValues={userInfo}
      autoComplete="off"
      ref={formRef}
      onFinish={submitHandle}
    >
      <Form.Item
        label="用户账号"
        name="loginId"
        rules={[{ required: true, message: '请输入用户账号' }]}
      >
        <Input
          value={userInfo?.loginId}
          placeholder="账号为必填项"
          onChange={(e) => updataInfo(e.target.value, 'loginId')}
        />
      </Form.Item>

      <Form.Item
        label="用户密码"
        name="loginPwd"
        rules={[
          type === 'edit' ? { required: true, message: '密码不能为空' } : null,
        ]}
      >
        <Input
          value={userInfo?.loginPwd}
          placeholder={type === 'add' ? '密码可选，默认为123123' : ''}
          onChange={(e) => updataInfo(e.target.value, 'loginPwd')}
        />
      </Form.Item>

      <Form.Item
        label="用户昵称"
        name="nickname"
        rules={[
          type === 'edit' ? { required: true, message: '昵称不能为空' } : null,
        ]}
      >
        <Input
          value={userInfo?.nickname}
          placeholder={type === 'add' ? '昵称可选，默认为新用户' : ''}
          onChange={(e) => updataInfo(e.target.value, 'nickname')}
        />
      </Form.Item>

      {/* 当前头像 */}
      {avatarPreview}

      <Form.Item label="用户头像">
        <Upload
          listType="picture-card"
          maxCount={1}
          action="/api/upload"
          onChange={(e) => {
            if (e.file.status === 'done') {
              const url = e.file.response.data;
              updataInfo(url, 'avatar');
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: '8px' }}>头像可选</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item label="用户邮箱" name="mail">
        <Input
          value={userInfo?.mail}
          placeholder="选填"
          onChange={(e) => updataInfo(e.target.value, 'mail')}
        />
      </Form.Item>

      <Form.Item label="QQ号" name="qq">
        <Input
          value={userInfo?.qq}
          placeholder="选填"
          onChange={(e) => updataInfo(e.target.value, 'qq')}
        />
      </Form.Item>

      <Form.Item label="微信号" name="wechat">
        <Input
          value={userInfo?.wechat}
          placeholder="选填"
          onChange={(e) => updataInfo(e.target.value, 'wechat')}
        />
      </Form.Item>

      <Form.Item label="自我介绍" name="intro">
        <Input.TextArea
          rows={6}
          value={userInfo?.intro}
          placeholder="选填"
          onChange={(e) => updataInfo(e.target.value, 'intro')}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {type === 'add' ? '确认新增' : '修改'}
        </Button>
        <Button type="link" htmlType="submit" className="resetBtn">
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UserForm;

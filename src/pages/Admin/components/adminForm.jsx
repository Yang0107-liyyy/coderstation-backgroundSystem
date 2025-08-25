import AdminController from '@/services/admin';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Radio, Upload } from 'antd';
import { useRef } from 'react';

/**
 * 公共的表单，用于新增和修改管理员
 */
function AdminForm({ type, adminInfo, setAdminInfo, submitHandle }) {
  // 回填表单
  const formRef = useRef();
  if (formRef.current) {
    formRef.current.setFieldsValue(adminInfo);
  }

  // 当前头像
  let avatarPreview = null;
  if (type === 'edit') {
    avatarPreview = (
      <Form.Item label="当前头像" name="avatarPreview">
        <Image src={adminInfo?.avatar} width={100} />
      </Form.Item>
    );
  }

  // 更新表单的内容到状态里面
  function updateInfo(newContent, key) {
    const newAdminInfo = { ...adminInfo };
    newAdminInfo[key] = newContent;
    setAdminInfo(newAdminInfo);
  }

  // 验证管理员账号是否已经添加过了
  async function checkLoginId() {
    if (adminInfo.loginId && type === 'add') {
      const { data } = await AdminController.adminIsExist(adminInfo.loginId);
      if (data) {
        return Promise.reject('该管理员已经注册过了');
      }
    }
  }

  return (
    <Form
      name="basic"
      initialValues={adminInfo}
      autoComplete="off"
      ref={formRef}
      onFinish={submitHandle}
    >
      {/* 管理员账号 */}
      <Form.Item
        label="管理员账号"
        name="loginId"
        rules={[
          { required: true, message: '请输入管理员账号' },
          { validateTrigger: 'onBlur', validator: checkLoginId },
        ]}
      >
        <Input
          value={adminInfo?.loginId}
          onChange={(e) => updateInfo(e.target.value, 'loginId')}
          disabled={type === 'edit' ? true : false}
        />
      </Form.Item>

      {/* 管理员密码 */}
      <Form.Item
        label="管理员密码"
        name="loginPwd"
        rules={[
          type === 'edit' ? { required: true, message: '密码不能为空' } : null,
        ]}
      >
        <Input.Password
          placeholder={type === 'add' ? '密码可选，默认是123123' : ''}
          value={adminInfo?.loginPwd}
          onChange={(e) => updateInfo(e.target.value, 'loginPwd')}
        />
      </Form.Item>

      {/* 管理员昵称 */}
      <Form.Item
        label="管理员昵称"
        name="nickname"
        rules={[
          type === 'edit' ? { required: true, message: '昵称不能为空' } : null,
        ]}
      >
        <Input
          placeholder={type === 'add' ? '昵称可选，默认是新增管理员' : ''}
          value={adminInfo?.nickname}
          onChange={(e) => updateInfo(e.target.value, 'nickname')}
        />
      </Form.Item>

      {/* 权限选择 */}
      <Form.Item
        label="权限选择"
        name="permission"
        rules={[{ required: true, message: '请选择管理员权限' }]}
      >
        <Radio.Group
          value={adminInfo?.permission}
          onChange={(e) => updateInfo(e.target.value, 'permission')}
        >
          <Radio value={2}>普通管理员</Radio>
          <Radio value={1}>超级管理员</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 当前头像 */}
      {avatarPreview}

      {/* 上传头像 */}
      <Form.Item label="上传头像">
        <Upload
          listType="picture-card"
          maxCount={1}
          action="/api/upload"
          onChange={(e) => {
            if (e.file.status === 'done') {
              const url = e.file.response.data;
              updateInfo(url, 'avatar');
            }
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: '8px' }}>头像可选</div>
          </div>
        </Upload>
      </Form.Item>

      {/* 按钮 */}
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

export default AdminForm;

import UserController from '@/services/user';
import { formatDate } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Access, useAccess, useNavigate } from '@umijs/max';
import { Button, Image, message, Modal, Popconfirm, Switch, Tag } from 'antd';
import { useRef, useState } from 'react';

function User(props) {
  const actionRef = useRef();
  const navigate = useNavigate();
  const access = useAccess();

  const [userInfo, setUserInfo] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      search: false,
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: '登录账号',
      align: 'center',
      dataIndex: 'loginId',
      key: 'loginId',
    },
    {
      title: '登录密码',
      align: 'center',
      dataIndex: 'loginPwd',
      key: 'loginPwd',
      search: false,
    },
    {
      title: '昵称',
      align: 'center',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '头像',
      align: 'center',
      dataIndex: 'avatar',
      key: 'avatar',
      search: false,
      valueType: 'avatar',
    },
    {
      title: '账号状态',
      align: 'center',
      dataIndex: 'enabled',
      key: 'enabled',
      search: false,
      render: (_, row) => {
        return (
          <Switch
            key={row._id}
            defaultChecked={row.enabled ? true : false}
            size="small"
            onChange={(value) => switchChange(row, value)}
          />
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, row) => {
        return (
          <div>
            <Button type="link" size="small" onClick={() => showModal(row)}>
              详情
            </Button>

            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/user/editUser/${row._id}`)}
            >
              编辑
            </Button>

            <Access accessible={access.SuperAdmin}>
              <Popconfirm
                title="是否确定删除此用户"
                onConfirm={() => deleteHandle(row)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small">
                  删除
                </Button>
              </Popconfirm>
            </Access>
          </div>
        );
      },
    },
  ];

  // 删除用户
  function deleteHandle(row) {
    UserController.deleteUser(row._id);
    actionRef.current.reload();
    message.success('删除用户成功');
  }

  // 翻页
  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize,
    });
  }

  // 修改用户的账号状态
  function switchChange(row, value) {
    UserController.editUser(row._id, { enabled: value });
    if (value) {
      message.success('用户状态已激活');
    } else {
      message.success('该用户已被禁用');
    }
  }

  const showModal = (row) => {
    setUserInfo(row);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <PageContainer>
        <ProTable
          headerTitle="用户列表"
          actionRef={actionRef}
          columns={columns}
          rowKey={(row) => row._id}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 15, 20],
            ...pagination,
            onChange: handlePageChange,
          }}
          request={async (params) => {
            const result = await UserController.getUserByPage(params);
            return {
              data: result.data.data,
              success: !result.code,
              total: result.data.count,
            };
          }}
        />
      </PageContainer>

      <Modal
        style={{ top: 20 }}
        title={userInfo?.nickname}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <h3>用户账号</h3>
        <p>
          <Tag color="red">{userInfo?.loginId}</Tag>
        </p>
        <h3>用户密码</h3>
        <p>
          <Tag color="magenta">{userInfo?.loginPwd}</Tag>
        </p>
        <h3>用户头像</h3>
        <Image src={userInfo?.avatar} width={60} />
        <h3>联系方式</h3>
        <div
          style={{
            display: 'flex',
            width: '350px',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4>QQ</h4>
            <p>{userInfo?.qq ? userInfo.qq : '未填写'}</p>
          </div>
          <div>
            <h4>微信</h4>
            <p>{userInfo?.wechat ? userInfo.weichat : '未填写'}</p>
          </div>
          <div>
            <h4>邮箱</h4>
            <p>{userInfo?.mail ? userInfo.mail : '未填写'}</p>
          </div>
        </div>
        <h3>个人简介</h3>
        <p>{userInfo?.intro ? userInfo.intro : '未填写'}</p>
        <div
          style={{
            display: 'flex',
            width: '450px',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4>注册时间</h4>
            <p>{formatDate(userInfo?.registerDate)}</p>
          </div>
          <div>
            <h4>上次登录</h4>
            <p>{formatDate(userInfo?.lastLoginDate)}</p>
          </div>
        </div>
        <h3>当前积分</h3>
        <p>{userInfo?.points} 分</p>
      </Modal>
    </div>
  );
}

export default User;

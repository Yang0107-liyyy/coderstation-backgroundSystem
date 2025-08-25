import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useDispatch, useSelector } from '@umijs/max';
import { Button, Form, Input, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';

function Type(props) {
  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const [newTypeInfo, setNewTypeInfo] = useState('');

  useEffect(() => {
    if (!typeList.length) {
      dispatch({
        type: 'type/_initTypeList',
      });
    }
  }, [typeList]);

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center',
      editable: true,
    },
    {
      title: '操作',
      width: 200,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Popconfirm
              title="你确定要删除？"
              onConfirm={() => deleteHandle(row)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="link" size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  function deleteHandle(typeInfo) {
    dispatch({
      type: 'type/_deleteType',
      payload: typeInfo,
    });
    message.success('删除类型成功');
  }

  function addHandle() {
    if (typeList.find((item) => item.typeName === newTypeInfo)) {
      message.warning('该类型已存在，请不要重复添加');
    } else {
      dispatch({
        type: 'type/_addType',
        payload: {
          typeName: newTypeInfo,
        },
      });
      message.success('新增类型成功');
    }
  }

  return (
    <PageContainer>
      <>
        <div style={{ width: 500, margin: 10, marginBottom: 30 }}>
          <Form layout="inline">
            <Form.Item name="newTypeName">
              <Input
                placeholder="填写新增类型"
                name="typeName"
                value={newTypeInfo}
                onChange={(e) => setNewTypeInfo(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" onClick={addHandle}>
                新增
              </Button>
            </Form.Item>
          </Form>
        </div>

        <ProTable
          headerTitle="分类信息"
          dataSource={typeList}
          columns={columns}
          search={false}
          rowKey={(row) => row._id}
          pagination={{
            pageSize: 5,
          }}
        />
      </>
    </PageContainer>
  );
}

export default Type;

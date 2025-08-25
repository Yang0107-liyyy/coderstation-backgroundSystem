import InterviewController from '@/services/interview';
import { typeOptionCreator } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useDispatch, useNavigate, useSelector } from '@umijs/max';
import { Button, Popconfirm, Select, Tag, message } from 'antd';
import { useRef, useState } from 'react';

function Interview(props) {
  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionRef = useRef();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchType, setSearchType] = useState({
    typeId: null,
  });

  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

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
      title: '题目名称',
      align: 'center',
      dataIndex: 'interviewTitle',
      key: 'interviewTitle',
      render: (_, row) => {
        let brief = null;
        if (row.interviewTitle.length > 22) {
          brief = row.interviewTitle.slice(0, 22) + '...';
        } else {
          brief = row.interviewTitle;
        }
        return brief;
      },
    },
    {
      title: '题目类型',
      align: 'center',
      dataIndex: 'typeId',
      key: 'typeId',
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest },
        form,
      ) => {
        return (
          <Select placeholder="请选择查询分类" onChange={handleChange}>
            {typeOptionCreator(Select, typeList)}
          </Select>
        );
      },
      render: (_, row) => {
        const type = typeList.find((item) => item._id === row.typeId);
        return (
          <Tag color="blue" key={row.typeId}>
            {type.typeName}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      key: 'option',
      fixed: 'right',
      valueType: 'option',
      width: 200,
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/interview/interviewList/${row._id}`)}
            >
              详情
            </Button>

            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/interview/editInterview/${row._id}`)}
            >
              编辑
            </Button>

            <Popconfirm
              title="是否要删除该面试题？"
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

  function deleteHandle(interviewInfo) {
    InterviewController.deleteInterview(interviewInfo._id);
    actionRef.current.reload();
    message.success('面试题删除成功');
  }

  function handleChange(value) {
    setSearchType({
      typeId: value,
    });
  }

  // 翻页
  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize,
    });
  }

  return (
    <PageContainer>
      <ProTable
        headerTitle="面试题列表"
        rowKey={(row) => row._id}
        columns={columns}
        actionRef={actionRef}
        params={searchType}
        onReset={() => {
          setSearchType({
            typeId: null,
          });
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50, 100],
          ...pagination,
          onChange: handlePageChange,
        }}
        request={async (params) => {
          const result = await InterviewController.getInterviewByPage(params);
          return {
            data: result.data.data,
            success: !result.code,
            total: result.data.count,
          };
        }}
      />
    </PageContainer>
  );
}

export default Interview;

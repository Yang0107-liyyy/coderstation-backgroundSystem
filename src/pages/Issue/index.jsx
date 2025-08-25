import IssueController from '@/services/issue';
import { typeOptionCreator } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useDispatch, useNavigate, useSelector } from '@umijs/max';
import { Button, Popconfirm, Select, Switch, Tag, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

function Issue(props) {
  const actionRef = useRef();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const { typeList } = useSelector((state) => state.type);
  const [searchType, setSearchType] = useState({
    typeId: null,
  });

  useEffect(() => {
    if (!typeList.length) {
      dispatch({
        type: 'type/_initTypeList',
      });
    }
  }, []);

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
      title: '问题标题',
      dataIndex: 'issueTitle',
      key: 'issueTitle',
      search: false,
      render: (_, row) => {
        let brief = row.issueTitle;
        if (brief.length > 20) {
          brief = brief.slice(0, 20) + '...';
        }
        return brief;
      },
    },
    {
      title: '问题描述',
      dataIndex: 'issueContent',
      key: 'issueContent',
      search: false,
      render: (_, row) => {
        let reg = /<[^<>]+>/g;
        let brief = row.issueContent;
        brief = brief.replace(reg, '');
        if (brief.length > 25) {
          brief = brief.slice(0, 25) + '...';
        }
        return brief;
      },
    },
    {
      title: '浏览数',
      align: 'center',
      dataIndex: 'scanNumber',
      key: 'scanNumber',
      search: false,
    },
    {
      title: '评论数',
      align: 'center',
      dataIndex: 'commentNumber',
      key: 'commentNumber',
      search: false,
    },
    {
      title: '问题类型',
      align: 'center',
      dataIndex: 'typeId',
      key: 'typeId',
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest },
        form,
      ) => {
        return (
          <Select
            placeholder="请选择查询类型"
            onChange={(value) => {
              setSearchType({
                typeId: value,
              });
            }}
          >
            {typeOptionCreator(Select, typeList)}
          </Select>
        );
      },
      render: (_, row) => {
        const type = typeList.find((item) => item._id === row.typeId);
        return (
          <Tag color="pink" key={row.typeId}>
            {type.typeName}
          </Tag>
        );
      },
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'issueStatus',
      key: 'issueStatus',
      render: (_, row) => {
        return (
          <Switch
            key={row._id}
            size="small"
            defaultChecked={row.issueStatus ? true : false}
            onChange={(value) => switchChange(row, value)}
          />
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      key: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button
              size="small"
              type="link"
              onClick={() => navigate(`/issue/${row._id}`)}
            >
              详情
            </Button>

            <Popconfirm
              title="是否要删除该问题以及该问题对应的评论？"
              onConfirm={() => deleteHandle(row)}
              okText="删除"
              cancelText="取消"
            >
              <Button size="small" type="link">
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // 删除问答
  function deleteHandle(row) {
    IssueController.deleteIssue(row._id);
    actionRef.current.reload();
    message.success('删除问答成功');
  }

  // 修改问答的审核状态
  function switchChange(row, value) {
    IssueController.editIssue(row._id, {
      issueStatus: value,
    });
    if (value) {
      message.success('该问答审核通过');
    } else {
      message.success('该问答待审核');
    }
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
        headerTitle="问答列表"
        rowKey={(row) => row._id}
        actionRef={actionRef}
        columns={columns}
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
          const result = await IssueController.getIssueByPage(params);
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

export default Issue;

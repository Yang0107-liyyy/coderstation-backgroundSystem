import { formatDate, typeOptionCreator } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useDispatch, useNavigate, useSelector } from '@umijs/max';
import { Button, Popconfirm, Select, Tag, message } from 'antd';
import { useRef, useState } from 'react';

import BookController from '@/services/book';

function Book(props) {
  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const actionRef = useRef();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState({
    typeId: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 获取书籍分类列表
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
      title: '书籍名称',
      align: 'center',
      width: 150,
      dataIndex: 'bookTitle',
      key: 'bookTitle',
    },
    {
      title: '书籍分类',
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
        // 找到对应的类型名称
        const type = typeList.find((item) => item._id === row.typeId);
        return (
          <Tag color="purple" key={row.typeId}>
            {type.typeName}
          </Tag>
        );
      },
    },
    {
      title: '书籍简介',
      align: 'center',
      width: 200,
      dataIndex: 'bookIntro',
      key: 'age',
      search: false,
      render: (_, row) => {
        let reg = /<[^<>]+>/g;
        let brief = row.bookIntro;
        brief = brief.replace(reg, '');
        if (brief.length > 15) {
          brief = brief.slice(0, 15) + '...';
        }
        return brief;
      },
    },
    {
      title: '书籍封面',
      align: 'center',
      dataIndex: 'bookPic',
      key: 'bookPic',
      valueType: 'image',
      search: false,
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
      title: '上架日期',
      align: 'center',
      dataIndex: 'onShelfDate',
      key: 'onShelfDate',
      search: false,
      render: (_, row) => {
        return formatDate(row.onShelfDate);
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 150,
      fixed: 'right',
      key: 'option',
      valueType: 'option',
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button
              type="link"
              size="small"
              onClick={() => navigate(`/book/editBook/${row._id}`)}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否要删除该书籍以及该书籍对应的评论？"
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

  function deleteHandle(bookInfo) {
    BookController.deleteBook(bookInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success('删除书籍成功');
  }

  function handleChange(value) {
    setSearchType({
      typeId: value,
    });
  }

  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize,
    });
  }

  return (
    <PageContainer>
      <ProTable
        headerTitle="书籍列表"
        actionRef={actionRef}
        params={searchType}
        columns={columns}
        rowKey={(row) => row._id}
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
          const result = await BookController.getBookByPage(params);
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

export default Book;

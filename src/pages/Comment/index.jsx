import BookController from '@/services/book';
import CommentController from '@/services/comment';
import IssueController from '@/services/issue';
import UserController from '@/services/user';
import { typeOptionCreator } from '@/utils/tool';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useDispatch, useSelector } from '@umijs/max';
import { Button, Modal, Popconfirm, Radio, Select, Tag, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

function Comment(props) {
  const [commentType, setCommentType] = useState(1);
  const actionRef = useRef();
  // 按类型进行搜索
  const [searchType, setSearchType] = useState({
    typeId: null,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // 存储评论对应的问答或者书籍标题
  const [titleArr, setTitleArr] = useState([]);

  // 存储评论对应所有的用户
  const [userArr, setUserArr] = useState([]);

  // 获取分类类型
  const dispatch = useDispatch();
  const { typeList } = useSelector((state) => state.type);
  useEffect(() => {
    if (!typeList.length) {
      dispatch({
        type: 'type/_initTypeList',
      });
    }
  }, []);

  // 存储详情页的问答标题内容或者书籍标题内容
  const [titleInfo, setTitleInfo] = useState([]);
  // 存储详情页的评论内容
  const [commentInfo, setCommentInfo] = useState(null);
  // 存储详情页的用户内容
  const [userInfo, setUserInfo] = useState([]);
  // 存储详情页的类型内容
  const [typeInfo, setTypeInfo] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function showModal(row) {
    // 问答标题内容或者书籍标题内容
    const id = row.issueId ? row.issueId : row.bookId;
    const title = titleArr.find((item) => item._id === id);
    setTitleInfo(title);
    // 评论内容
    let reg = /<[^<>]+>/g;
    let brief = row.commentContent;
    brief = brief.replace(reg, '');
    setCommentInfo(brief);
    // 用户内容
    const user = userArr.find((item) => item._id === row.userId);
    setUserInfo(user);
    // 评论类型
    const type = typeList.find((item) => item._id === row.typeId);
    setTypeInfo(type);

    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
      title: commentType === 1 ? '问答标题' : '书籍标题',
      dataIndex: 'commentTitle',
      key: 'commentTitle',
      search: false,
      render: (_, row) => {
        const id = row.issueId ? row.issueId : row.bookId;
        const title = titleArr.find((item) => item._id === id);
        return [commentType === 1 ? title.issueTitle : title.bookTitle];
      },
    },
    {
      title: '评论内容',
      dataIndex: 'commentContent',
      key: 'commentContent',
      search: false,
      render: (_, row) => {
        let brief = row.commentContent;
        if (commentType === 1) {
          let reg = /<[^<>]+>/g;
          brief = brief.replace(reg, '');
          if (brief.length > 22) {
            brief = brief.slice(0, 22) + '...';
          }
          return brief;
        } else {
          if (brief.length > 22) {
            brief = brief.slice(0, 22) + '...';
          }
          return brief;
        }
      },
    },
    {
      title: '评论用户',
      align: 'center',
      dataIndex: 'userId',
      key: 'userId',
      search: false,
      render: (_, row) => {
        const users = userArr.find((item) => item._id === row.userId);
        return (
          <Tag color="red" key={row.userId}>
            {users.nickname}
          </Tag>
        );
      },
    },
    {
      title: '评论类型',
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
            onChange={(value) =>
              setSearchType({
                typeId: value,
              })
            }
          >
            {typeOptionCreator(Select, typeList)}
          </Select>
        );
      },
      render: (_, row) => {
        const types = typeList.find((item) => item._id === row.typeId);
        return (
          <Tag color="orange" key={row.typeId}>
            {types.typeName}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, row) => {
        return (
          <div key={row._id}>
            <Button size="small" type="link" onClick={() => showModal(row)}>
              详情
            </Button>

            <Popconfirm
              title="是否要删除该条评论？"
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

  // 删除评论
  function deleteHandle(commentInfo) {
    CommentController.deleteComment(commentInfo._id);
    actionRef.current.reload(); // 再次刷新请求
    message.success('删除评论成功');

    if (commentType === 1) {
      async function fetchData() {
        const { data } = await IssueController.getIssueById(
          commentInfo.issueId,
        );

        IssueController.editIssue(commentInfo.issueId, {
          commentNumber: data.commentNumber - 1,
        });
      }
      fetchData();
    } else if (commentType === 2) {
      async function fetchData() {
        const { data } = await BookController.getBookById(commentInfo.bookId);

        BookController.editBook(commentInfo.bookId, {
          commentNumber: data.commentNumber - 1,
        });
      }
      fetchData();
    }
  }

  // 翻页
  function handlePageChange(current, pageSize) {
    setPagination({
      current,
      pageSize,
    });
  }

  // 切换模块
  function onChange(e) {
    setCommentType(e.target.value);
    actionRef.current.reload(); // 重新刷新表格数据
  }

  return (
    <div>
      <PageContainer>
        <Radio.Group
          onChange={onChange}
          value={commentType}
          style={{
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          <Radio.Button value={1} defaultChecked>
            问答评论
          </Radio.Button>
          <Radio.Button value={2}>书籍评论</Radio.Button>
        </Radio.Group>

        <ProTable
          headerTitle="评论列表"
          key={(row) => row._id}
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
            const result = await CommentController.getCommentByType(
              params,
              commentType,
            );
            const tableData = result.data.data;

            const titleArr = [];
            const userArr = [];
            for (let i = 0; i < tableData.length; i++) {
              const id = tableData[i].issueId
                ? tableData[i].issueId
                : tableData[i].bookId;
              if (commentType === 1) {
                const { data } = await IssueController.getIssueById(id);
                titleArr.push(data);
              } else {
                const { data } = await BookController.getBookById(id);
                titleArr.push(data);
              }

              const { data } = await UserController.getUserById(
                tableData[i].userId,
              );
              userArr.push(data);
            }
            setTitleArr(titleArr);
            setUserArr(userArr);

            return {
              data: tableData,
              success: !result.code,
              total: result.data.count,
            };
          }}
        />
      </PageContainer>

      <Modal
        title="评论详情"
        open={isModalOpen}
        onCancel={handleCancel}
        style={{ top: 50 }}
        footer={false}
      >
        <h3>标题</h3>
        <p>
          {titleInfo.issueTitle ? titleInfo.issueTitle : titleInfo.bookTitle}
        </p>

        <h3>评论内容</h3>
        <p>{commentInfo}</p>

        <h3>评论用户</h3>
        <div style={{ marginBottom: 15 }}>
          <Tag color="red" key={userInfo._id}>
            {userInfo.nickname}
          </Tag>
        </div>

        <h3>评论类型</h3>
        <div>
          <Tag color="orange" key={typeInfo._id}>
            {typeInfo.typeName}
          </Tag>
        </div>
      </Modal>
    </div>
  );
}

export default Comment;

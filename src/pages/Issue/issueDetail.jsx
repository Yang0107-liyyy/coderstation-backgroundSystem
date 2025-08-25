import IssueController from '@/services/issue';
import UserController from '@/services/user';
import { formatDate } from '@/utils/tool';
import { PageContainer } from '@ant-design/pro-components';
import { useDispatch, useParams, useSelector } from '@umijs/max';
import { Card, Tag } from 'antd';
import { useEffect, useState } from 'react';

function IssueDetail(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [issueInfo, setIssueInfo] = useState(null);
  const [typeName, setTypeName] = useState(null);
  const [userName, setUserName] = useState(null);

  const { typeList } = useSelector((state) => state.type);

  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

  useEffect(() => {
    async function fetchData() {
      const { data } = await IssueController.getIssueById(id);
      setIssueInfo(data);

      const type = typeList.find((item) => item._id === data.typeId);
      setTypeName(type?.typeName);

      const result = await UserController.getUserById(data.userId);
      setUserName(result.data.nickname);
    }
    if (id) {
      fetchData();
    }
  }, []);

  return (
    <PageContainer>
      <div className="container" style={{ width: '100%', margin: 'auto' }}>
        <Card
          title={issueInfo?.issueTitle}
          bordered={false}
          style={{ marginTop: 20 }}
          extra={
            <Tag color="pink" key={issueInfo?.typeId}>
              {typeName}
            </Tag>
          }
        >
          <h4>提问用户</h4>
          <p style={{ marginBottom: 30 }}>
            <Tag color="cyan" key={issueInfo?.userId}>
              {userName}
            </Tag>
          </p>

          <h3>问题描述</h3>
          <div
            dangerouslySetInnerHTML={{ __html: issueInfo?.issueContent }}
            style={{ marginBottom: 40 }}
          ></div>

          <h4>提问时间： {formatDate(issueInfo?.issueDate)}</h4>

          <h4>浏览数： {issueInfo?.scanNumber}</h4>

          <h4>评论数： {issueInfo?.commentNumber}</h4>
        </Card>
      </div>
    </PageContainer>
  );
}

export default IssueDetail;

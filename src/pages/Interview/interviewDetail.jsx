import InterviewController from '@/services/interview';
import { PageContainer } from '@ant-design/pro-components';
import { useDispatch, useParams, useSelector } from '@umijs/max';
import { Card, Tag } from 'antd';
import { useEffect, useState } from 'react';

function InterviewDetail(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [typeName, setTypeName] = useState(null);

  const { typeList } = useSelector((state) => state.type);
  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

  useEffect(() => {
    async function fetchData() {
      // 获得 id 对应的面试题
      const { data } = await InterviewController.getInterviewById(id);
      setInterviewInfo(data);
      // 获取 typeId 对应的 typeName
      const type = typeList.find((item) => item._id === data.typeId);
      setTypeName(type?.typeName);
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      <Card
        title={interviewInfo?.interviewTitle}
        style={{ marginBottom: 10 }}
        extra={
          <Tag color="blue" key={interviewInfo?.typeId}>
            {typeName}
          </Tag>
        }
      >
        <div
          dangerouslySetInnerHTML={{ __html: interviewInfo?.interviewContent }}
        ></div>
      </Card>
    </PageContainer>
  );
}

export default InterviewDetail;

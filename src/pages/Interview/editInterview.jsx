import InterviewController from '@/services/interview';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import InterviewForm from './components/interviewForm';

function EditInterview(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interviewInfo, setInterviewInfo] = useState(null);

  // 获取面试题信息
  useEffect(() => {
    async function fetchData() {
      const { data } = await InterviewController.getInterviewById(id);
      setInterviewInfo(data);
    }
    fetchData();
  }, []);

  function submitHandle(interviewContent) {
    InterviewController.editInterview(id, {
      interviewTitle: interviewInfo.interviewTitle,
      interviewContent,
      typeId: interviewInfo.typeId,
    });
    navigate('/interview/interviewList');
    message.success('修改题目成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 950 }}>
        <InterviewForm
          type="edit"
          interviewInfo={interviewInfo}
          setInterviewInfo={setInterviewInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default EditInterview;

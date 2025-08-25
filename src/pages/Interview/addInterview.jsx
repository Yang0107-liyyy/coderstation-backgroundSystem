import InterviewController from '@/services/interview';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { message } from 'antd';
import { useState } from 'react';
import InterviewForm from './components/interviewForm';

function AddInterview(props) {
  const navigate = useNavigate();

  const [newInterviewInfo, setNewInterviewInfo] = useState({
    interviewTitle: '',
    interviewContent: '',
    typeId: '',
  });

  function submitHandle(interviewContent) {
    InterviewController.addInterview({
      interviewTitle: newInterviewInfo.interviewTitle,
      interviewContent,
      typeId: newInterviewInfo.typeId,
    });
    navigate('/interview/interviewList');
    message.success('新增面试题成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 950 }}>
        <InterviewForm
          type="add"
          interviewInfo={newInterviewInfo}
          setInterviewInfo={setNewInterviewInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default AddInterview;

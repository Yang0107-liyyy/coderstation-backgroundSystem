import BookController from '@/services/book';
import InterviewController from '@/services/interview';
import IssueController from '@/services/issue';
import { Bar } from '@ant-design/plots';
import { useDispatch, useSelector } from '@umijs/max';
import { useEffect, useState } from 'react';

function Number(props) {
  const { typeList } = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const [bookNumber, setBookNumber] = useState(0);
  const [interviewNumber, setInterviewNumber] = useState(0);
  const [issueNumber, setIssueNumber] = useState(0);

  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

  useEffect(() => {
    const params = {
      current: 1,
      pageSize: 10,
    };
    async function fetchData() {
      const book = await BookController.getBookByPage(params);
      const bookNumber = book.data.count;
      setBookNumber(bookNumber);

      const interview = await InterviewController.getInterviewByPage(params);
      const interviewNumber = interview.data.count;
      setInterviewNumber(interviewNumber);

      const issue = await IssueController.getIssueByPage(params);
      const issueNumber = issue.data.count;
      setIssueNumber(issueNumber);
    }
    fetchData();
  }, []);

  const data = [
    { year: '书籍', value: bookNumber },
    { year: '面试题', value: interviewNumber },
    { year: '问答', value: issueNumber },
    { year: '类型', value: typeList.length },
  ];
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    shapeField: 'hollow',
    colorField: 'year',
    legend: {
      color: { size: 72, autoWrap: true, maxRows: 3, cols: 6 },
    },
  };
  return <Bar {...config} />;
}

export default Number;

import BookController from '@/services/book';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate, useParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import BookForm from './components/bookForm';

function EditBook(props) {
  const { id } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const navigate = useNavigate();

  // 通过 id 获取 bookInfo
  useEffect(() => {
    async function fetchData() {
      const { data } = await BookController.getBookById(id);
      setBookInfo(data);
    }
    fetchData();
  }, []);

  function submitHandle(bookIntro) {
    BookController.editBook(id, {
      bookTitle: bookInfo.bookTitle,
      bookIntro,
      downloadLink: bookInfo.downloadLink,
      requirePoints: bookInfo.requirePoints,
      bookPic: bookInfo.bookPic,
      typeId: bookInfo.typeId,
    });
    navigate('/book/bookList');
    message.success('书籍信息修改成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 950 }}>
        <BookForm
          type="edit"
          bookInfo={bookInfo}
          setBookInfo={setBookInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default EditBook;

import BookController from '@/services/book';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { message } from 'antd';
import { useState } from 'react';
import BookForm from './components/bookForm';

function AddBook(props) {
  const navigate = useNavigate();

  const [newBookInfo, setNewBookInfo] = useState({
    bookTitle: '',
    bookIntro: '',
    downloadLink: '',
    requirePoints: '',
    bookPic: '',
    typeId: '',
  });

  function submitHandle(bookIntro) {
    BookController.addBook({
      bookTitle: newBookInfo.bookTitle,
      bookIntro,
      downloadLink: newBookInfo.downloadLink,
      requirePoints: newBookInfo.requirePoints,
      bookPic: newBookInfo.bookPic,
      typeId: newBookInfo.typeId,
    });
    navigate('/book/bookList');
    message.success('添加书籍成功');
  }

  return (
    <PageContainer>
      <div className="container" style={{ width: 950 }}>
        <BookForm
          type="add"
          bookInfo={newBookInfo}
          setBookInfo={setNewBookInfo}
          submitHandle={submitHandle}
        />
      </div>
    </PageContainer>
  );
}

export default AddBook;

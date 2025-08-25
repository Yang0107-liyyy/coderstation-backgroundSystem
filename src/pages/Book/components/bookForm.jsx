import { typeOptionCreator } from '@/utils/tool';
import { PlusOutlined } from '@ant-design/icons';
import '@toast-ui/editor/dist/i18n/zh-cn';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useDispatch, useSelector } from '@umijs/max';
import { Button, Form, Image, Input, Select, Upload } from 'antd';
import { useRef, useState } from 'react';

function BookForm({ type, bookInfo, setBookInfo, submitHandle }) {
  const formRef = useRef();
  const editorRef = useRef();
  // 编辑器是否是第一次回填
  const [firstIn, setFirstIn] = useState(true);
  // 回填表单
  if (type === 'edit') {
    if (formRef.current && firstIn && bookInfo) {
      formRef.current.setFieldsValue(bookInfo);
      editorRef.current.getInstance().setHTML(bookInfo?.bookIntro);
      setFirstIn(false);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue(bookInfo);
    }
  }

  // 获取书籍类型
  const dispatch = useDispatch();
  const { typeList } = useSelector((state) => state.type);
  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

  // 编辑书籍时书籍的当前封面
  let bookPicPreview = null;
  if (type === 'edit') {
    bookPicPreview = (
      <Form.Item label="当前封面" name="bookPicPreview">
        <Image src={bookInfo?.bookPic} width={100} />
      </Form.Item>
    );
  }

  // 根据用户填写内容实时更新表单控件内容
  function updataInfo(newInfo, key) {
    const newBookInfo = { ...bookInfo };
    newBookInfo[key] = newInfo;
    setBookInfo(newBookInfo);
  }

  function addHandle() {
    const content = editorRef.current.getInstance().getHTML();
    submitHandle(content);
  }

  return (
    <Form
      name="basic"
      initialValues={bookInfo}
      autoComplete="off"
      ref={formRef}
      onFinish={addHandle}
    >
      <Form.Item
        label="书籍标题"
        name="bookTitle"
        required={[{ required: true, message: '请输入书名' }]}
      >
        <Input
          value={bookInfo?.bookTitle}
          onChange={(e) => updataInfo(e.target.value, 'bookTitle')}
        />
      </Form.Item>

      <Form.Item
        label="书籍介绍"
        name="bookIntro"
        required={[{ required: true, message: '请输入书本相关介绍' }]}
      >
        <Editor
          initialValues=""
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          language="zh-CN"
          ref={editorRef}
        />
      </Form.Item>

      <Form.Item
        label="下载链接"
        name="downloadLink"
        required={[{ required: true, message: '请输入书籍下载链接' }]}
      >
        <Input
          value={bookInfo?.downloadLink}
          onChange={(e) => updataInfo(e.target.value, 'downloadLink')}
        />
      </Form.Item>

      <Form.Item
        label="所需积分"
        name="requirePoints"
        required={[{ required: true, message: '请选择下载所需积分' }]}
      >
        <Select
          style={{ width: 200 }}
          onChange={(value) => updataInfo(value, 'requirePoints')}
        >
          <Select.Option value={20} key={20}>
            20
          </Select.Option>
          <Select.Option value={30} key={30}>
            30
          </Select.Option>
          <Select.Option value={50} key={50}>
            50
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="书籍分类"
        name="typeId"
        required={[{ required: true, message: '请选择书籍类型' }]}
      >
        <Select
          style={{ width: 200 }}
          onChange={(value) => updataInfo(value, 'typeId')}
        >
          {typeOptionCreator(Select, typeList)}
        </Select>
      </Form.Item>

      {bookPicPreview}

      <Form.Item label="书籍封面" name="bookPic">
        <Upload
          action="/api/upload"
          listType="picture-card"
          maxCount={1}
          onChange={(e) => {
            if (e.file.status === 'done') {
              const url = e.file.response.data;
              updataInfo(url, 'bookPic');
            }
          }}
        >
          <PlusOutlined />
        </Upload>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {type === 'add' ? '确认新增' : '修改'}
        </Button>

        <Button type="link" htmlType="submit" className="resetBtn">
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default BookForm;

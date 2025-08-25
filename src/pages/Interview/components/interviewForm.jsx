import { typeOptionCreator } from '@/utils/tool';
import '@toast-ui/editor/dist/i18n/zh-cn';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useDispatch, useSelector } from '@umijs/max';
import { Button, Form, Input, Select } from 'antd';
import { useRef, useState } from 'react';

function InterviewForm({
  type,
  interviewInfo,
  setInterviewInfo,
  submitHandle,
}) {
  const formRef = useRef();
  const editorRef = useRef();
  const dispatch = useDispatch();
  // 回填表单
  const [firstIn, setFirstIn] = useState(true);
  if (type === 'edit') {
    if (formRef.current && firstIn && interviewInfo) {
      formRef.current.setFieldsValue(interviewInfo);
      editorRef.current.getInstance().setHTML(interviewInfo?.interviewContent);
      setFirstIn(false);
    }
    if (formRef.current) {
      formRef.current.setFieldsValue(interviewInfo);
    }
  }

  // 获取类型列表
  const { typeList } = useSelector((state) => state.type);
  if (!typeList.length) {
    dispatch({
      type: 'type/_initTypeList',
    });
  }

  // 根据用户填写的内容实时更新表单控件的内容
  function updateInfo(newInfo, key) {
    const newInterviewInfo = { ...interviewInfo };
    if (typeof newInfo === 'string') {
      newInterviewInfo[key] = newInfo.trim();
    } else {
      newInterviewInfo[key] = newInfo;
    }
    setInterviewInfo(newInterviewInfo);
  }

  function addHandle() {
    const content = editorRef.current.getInstance().getHTML();
    submitHandle(content);
  }

  return (
    <Form
      name="basic"
      initialValues={interviewInfo}
      autoComplete="off"
      ref={formRef}
      onFinish={addHandle}
    >
      <Form.Item
        label="题目标题"
        name="interviewTitle"
        required={[{ required: true, message: '请输入题目标题' }]}
      >
        <Input
          placeholder="填写题目标题"
          value={interviewInfo?.interviewTitle}
          onChange={(e) => updateInfo(e.target.value, 'interviewTitle')}
        />
      </Form.Item>

      <Form.Item
        label="题目类型"
        name="typeId"
        required={[{ required: true, message: '请选择题目类型' }]}
      >
        <Select
          style={{ width: 200 }}
          onChange={(value) => updateInfo(value, 'typeId')}
        >
          {typeOptionCreator(Select, typeList)}
        </Select>
      </Form.Item>

      <Form.Item
        label="题目内容"
        name="interviewContent"
        required={[{ required: true, message: '请输入题目内容' }]}
      >
        <Editor
          initialValue=""
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut={true}
          language="zh-CN"
          ref={editorRef}
        />
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

export default InterviewForm;

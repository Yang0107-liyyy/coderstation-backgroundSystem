import AdminController from '@/services/admin';
import { BarcodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import ReactCanvasNest from 'react-canvas-nest';
import styles from './index.module.css';

function Login(props) {
  const [captcha, setCaptcha] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    loginId: '',
    loginPwd: '',
    captcha: '',
    remember: true,
  });

  useEffect(() => {
    // 一开始需要先加载验证码
    captchaClickHandle();
  }, []);

  // 用户点击登录时，提交表单
  async function onFinish() {
    const result = await AdminController.login(loginInfo);
    if (result.data) {
      // 验证码正确
      const adminInfo = result.data;

      if (!adminInfo.data) {
        // 账号或密码不正确
        message.warning('账号或密码不正确');
        captchaClickHandle();
      } else if (!adminInfo.data.enabled) {
        // 账号被冻结
        message.warning('该账号已经被冻结，请联系管理员');
        captchaClickHandle();
      } else {
        // 账号、密码、验证码都正确
        localStorage.setItem('adminToken', adminInfo.token);
        location.href = '/';
      }
    } else {
      //验证码都不正确
      message.warning(result.msg);
      captchaClickHandle();
    }
  }

  // 用户填写内容时更新表单控件内容
  function updateInfo(newInfo, key) {
    const newLoginInfo = { ...loginInfo };
    if (typeof newInfo === 'string') {
      newLoginInfo[key] = newInfo.trim();
    } else {
      newLoginInfo[key] = newInfo;
    }
    setLoginInfo(newLoginInfo);
  }

  // 获取新的验证码
  async function captchaClickHandle() {
    const result = await AdminController.getCaptcha();
    setCaptcha(result);
  }

  return (
    <div>
      <ReactCanvasNest
        config={{
          pointColor: '255, 0, 0',
          count: 66,
          follow: false,
        }}
        style={{ zIndex: 1 }}
      />

      <div className={styles.container}>
        <h1>coder station 后台管理系统</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={loginInfo}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入账号"
              value={loginInfo.loginId}
              onChange={(e) => updateInfo(e.target.value, 'loginId')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请输入密码"
              type="password"
              value={loginInfo.loginPwd}
              onChange={(e) => updateInfo(e.target.value, 'loginPwd')}
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Row align="middle">
              <Col span={16}>
                <Input
                  prefix={<BarcodeOutlined className="site-form-item-icon" />}
                  placeholder="请输入验证码"
                  value={loginInfo.captcha}
                  onChange={(e) => updateInfo(e.target.value, 'captcha')}
                />
              </Col>
              <Col span={6}>
                <div
                  className={styles.captchaImg}
                  onClick={captchaClickHandle}
                  dangerouslySetInnerHTML={{ __html: captcha }}
                ></div>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="remember" className={styles.remember}>
            <Checkbox
              defaultChecked={loginInfo.remember}
              onChange={(e) => updateInfo(e.target.checked, 'remember')}
            >
              7天免登录
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginBtn}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;

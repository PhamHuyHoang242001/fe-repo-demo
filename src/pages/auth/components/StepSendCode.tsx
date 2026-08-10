import { Button, Form, Input } from 'antd';
import { ERROR_CODE } from '../../../types/api';
import { Link } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { STEP_ENTER_CODE } from '../store/Constants';
import { sendCodeApi } from '../api';

interface StepSendCodeProps {
  setStep: (step: string) => void;
  setEmail: (email: string) => void;
}

interface StepSendCodeForm {
  email: string;
}

const StepSendCode = ({ setStep, setEmail }: StepSendCodeProps) => {
  const onSubmitForm = async (value: StepSendCodeForm) => {
    try {
      const res = await sendCodeApi(value.email);

      if (res) {
        setStep(STEP_ENTER_CODE);
        setEmail(value.email);
      }
    } catch (error) {}
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name="normal_login"
      className="login-form mt-7"
      onFinish={onSubmitForm}
    >
      <Form.Item label="Email Address" name="email" rules={[{ required: true, message: ERROR_CODE.A001 }]}>
        <Input placeholder="Please enter your email address" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full h-full rounded-lg">
          <span className="py-2 font-bold">Send Email</span>
        </Button>
      </Form.Item>
      <Link to="/login" className="text-black flex items-center gap-1 justify-center">
        <LeftOutlined />
        <span>Back to Sign-in</span>
      </Link>
    </Form>
  );
};

export default StepSendCode;

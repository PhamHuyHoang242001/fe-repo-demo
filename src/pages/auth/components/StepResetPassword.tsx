import { Button, Form, Input } from 'antd';
import { ERROR_CODE } from '../../../types/api';
import { useState } from 'react';
import { CheckFilledIcon } from 'components/icons/CheckFilledIcon';
import { CheckOutlinedIcon } from 'components/icons/CheckOutlinedIcon';
import { IRecoverPasswordApi } from '../../../types/login';
import { recoverPasswordApi } from '../api';
import { STEP_SUCCESS } from '../store/Constants';

interface StepResetPasswordProps {
  token: string;
  setStep: (step: string) => void;
}

const StepResetPassword = ({ token, setStep }: StepResetPasswordProps) => {
  const [form] = Form.useForm();
  const [validatePass, setValidatePass] = useState({
    minimum_8: false,
    one_number: false,
    one_up_case: false,
    one_special: false,
  });

  const handleCheckRegex = (value: string) => {
    const confirm_password_value = form.getFieldValue('confirm_password');
    const obj = JSON.parse(JSON.stringify(validatePass));

    if (value.length > 7 && value.length < 21) {
      obj.minimum_8 = true;
    } else {
      obj.minimum_8 = false;
    }

    if (/.*[0-9].*/.test(value)) {
      obj.one_number = true;
    } else {
      obj.one_number = false;
    }

    if (/.*[A-Z].*/.test(value)) {
      obj.one_up_case = true;
    } else {
      obj.one_up_case = false;
    }

    if (/.*[!@#$%^&*].*/.test(value)) {
      obj.one_special = true;
    } else {
      obj.one_special = false;
    }

    setValidatePass(obj);

    if (confirm_password_value) {
      form.validateFields();
    }
  };

  const onSubmitForm = async (values: IRecoverPasswordApi) => {
    if (validatePass.minimum_8 && validatePass.one_number && validatePass.one_up_case && validatePass.one_special) {
      try {
        const res = await recoverPasswordApi({
          password: values.password,
          confirm_password: values.confirm_password,
          token,
        });

        if (res) {
          setStep(STEP_SUCCESS);
        }
      } catch (error) {}
    }
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name="normal_login"
      className="login-form mt-7"
      onFinish={onSubmitForm}
    >
      <Form.Item label="New password" name="password" rules={[{ required: true, message: ERROR_CODE.A001 }]}>
        <Input.Password
          onChange={(e) => handleCheckRegex(e.target.value)}
          placeholder="Please enter your new password"
        />
      </Form.Item>
      <Form.Item
        label="Re-enter password"
        name="confirm_password"
        rules={[
          {
            required: true,
            message: ERROR_CODE['A001'],
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(ERROR_CODE['A004']));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Please confirm your new password" />
      </Form.Item>
      <div className="mt-2">
        <div className="flex gap-2 items-center mb-2">
          {validatePass.minimum_8 ? <CheckFilledIcon /> : <CheckOutlinedIcon />}
          <span className={`text-sm ${validatePass.minimum_8 ? 'text-status-success' : 'text-neutral-content'}`}>
            The password must contain between 8 and 20 characters.
          </span>
        </div>
        <div className="flex gap-2 items-center mb-2">
          {validatePass.one_up_case ? <CheckFilledIcon /> : <CheckOutlinedIcon />}
          <span className={`text-sm ${validatePass.one_up_case ? 'text-status-success' : 'text-neutral-content'}`}>
            The password must include both uppercase and lowercase letters.
          </span>
        </div>
        <div className="flex gap-2 items-center mb-2">
          {validatePass.one_number ? <CheckFilledIcon /> : <CheckOutlinedIcon />}
          <span className={`text-sm ${validatePass.one_number ? 'text-status-success' : 'text-neutral-content'}`}>
            The password must include at least one number.
          </span>
        </div>
        <div className="flex gap-2 items-center mb-2">
          {validatePass.one_special ? <CheckFilledIcon /> : <CheckOutlinedIcon />}
          <span className={`text-sm ${validatePass.one_special ? 'text-status-success' : 'text-neutral-content'}`}>
            The password may include special characters.
          </span>
        </div>
      </div>
      <Form.Item className="mt-7">
        <Button type="primary" htmlType="submit" className="w-full h-full rounded-lg">
          <span className="py-2 font-bold">Reset Password</span>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StepResetPassword;

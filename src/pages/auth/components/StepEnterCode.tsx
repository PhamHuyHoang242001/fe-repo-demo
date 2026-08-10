import { Button, notification } from 'antd';
import { useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import OtpInput from 'react-otp-input';
import { Link } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { sendCodeApi, verifyCodeApi } from '../api';
import { STEP_RESET_PASSWORD } from '../store/Constants';

interface StepEnterCodeProps {
  email: string;
  setStep: (step: string) => void;
  setToken: (token: string) => void;
}

interface ICountdown {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const StepEnterCode = ({ email, setStep, setToken }: StepEnterCodeProps) => {
  const [otp, setOtp] = useState<string>('');
  const [isResend, setIsResend] = useState(0);

  const handleResendCode = async () => {
    const res = await sendCodeApi(email);

    if (res) {
      setIsResend((prev) => prev + 1);
    }
  };

  const renderer = ({ seconds, completed }: ICountdown) => {
    if (completed) {
      return (
        <button
          onClick={() => handleResendCode()}
          className="text-base font-semibold text-primary bg-white border-none cursor-pointer"
        >
          Resend
        </button>
      );
    } else {
      return <span className="text-[15px] text-[#BCC8D3] font-semibold">Resend in (00:{zeroPad(seconds)})</span>;
    }
  };

  const submitVerifyCode = async () => {
    if (otp.length < 4) {
      return notification.error({ message: 'Please enter the 4 digits code' });
    }

    try {
      const res = await verifyCodeApi(email, otp);

      if (res) {
        setStep(STEP_RESET_PASSWORD);
        setToken(res.token);
      }
    } catch (error) {}
  };

  return (
    <div>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        renderInput={(props) => <input {...props} />}
        inputStyle="hiddeArrowsInput h-[65px] md:h-[95px] rounded-2xl border-[2px] border-neutral-border text-center text-[65px] md:text-[95px] font-semibold outline-none mx-1"
        containerStyle="flex justify-between mt-7"
        inputType="number"
      />
      <div className="mt-7 flex justify-between item-center">
        <p className="text-base font-semibold text-[#5E6270] m-0">Haven’t received the code?</p>
        <Countdown key={isResend} zeroPadDays={2} zeroPadTime={2} date={Date.now() + 59 * 1000} renderer={renderer} />
      </div>
      <Button
        onClick={() => submitVerifyCode()}
        type="primary"
        htmlType="submit"
        className="w-full h-full rounded-lg mt-7"
      >
        <span className="py-2 font-bold">Submit</span>
      </Button>
      <Link to="/login" className="text-black flex items-center gap-1 justify-center mt-6 text-[14px] decoration-0">
        <LeftOutlined />
        <span>Back to Sign-in</span>
      </Link>
    </div>
  );
};

export default StepEnterCode;

import '../styles/login.scss';
import { useState } from 'react';
import { STEP_ENTER_CODE, STEP_RESET_PASSWORD, STEP_SEND_CODE, STEP_SUCCESS } from '../store/Constants';
import StepSendCode from '../components/StepSendCode';
import StepEnterCode from '../components/StepEnterCode';
import StepResetPassword from '../components/StepResetPassword';
import StepSuccess from '../components/StepSuccess';

const ForgotPassword = () => {
  const [step, setStep] = useState<string>(STEP_SEND_CODE);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  return (
    <div className="login w-screen h-screen full-screen flex justify-center items-center position-rel">
      <div className="login__wrap bg-white rounded-lg">
        <h1 className="text-2xl text-center font-bold mb-1">
          {step === STEP_SEND_CODE && 'Forgot your password?'}
          {step === STEP_ENTER_CODE && 'Enter code'}
          {step === STEP_RESET_PASSWORD && 'Reset password'}
        </h1>
        <p className="text-center text-sm">
          {step === STEP_SEND_CODE && 'Enter your email so that we can send you a password reset otp'}
          {step === STEP_ENTER_CODE && 'We have sent a 4 digits code to your email. Please check your email and enter the code in the field below'}
          {step === STEP_RESET_PASSWORD && 'Please set your new password'}
        </p>
        {step === STEP_SEND_CODE && <StepSendCode setStep={setStep} setEmail={setEmail} />}
        {step === STEP_ENTER_CODE && <StepEnterCode email={email} setStep={setStep} setToken={setToken} />}
        {step === STEP_RESET_PASSWORD && <StepResetPassword token={token} setStep={setStep} />}
        {step === STEP_SUCCESS && <StepSuccess />}
      </div>
    </div>
  );
};

export default ForgotPassword;

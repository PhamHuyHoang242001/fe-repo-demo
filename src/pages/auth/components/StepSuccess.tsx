import { CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router';

const StepSuccess = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-center">
        <CheckCircleFilled className="text-8xl text-green-500" />
      </div>
      <h1 className="font-bold text-center mt-7">Your password has been successfully changed !</h1>
      <div>
        <Button
          onClick={() => navigate('/login')}
          type="primary"
          htmlType="submit"
          className="w-full h-full rounded-lg mt-7"
        >
          <span className="py-2 font-bold">Sign in now</span>
        </Button>
      </div>
    </div>
  );
};

export default StepSuccess;

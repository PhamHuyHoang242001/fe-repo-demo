import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { destroyLogged, isLogin, saveRefreshToken, saveToken, saveUserInfor } from 'utils/jwt';
import { loginApi } from './../api/index';
import '../styles/login.scss';
import { LoginReq } from 'types/login';
// import { ERROR_CODE } from '../../../types/api';
const logoImage = require('assets/images/logo-web.svg');
const placehlderImage = require('assets/images/Image_placehlder_1.svg');
const emailIcon = require('assets/icons/Email.svg');
const passwordIcon = require('assets/icons/Password.svg');
import Footer from 'layouts/Footer';
import { useTranslation } from 'react-i18next';

const Login: React.FC = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authLogged = isLogin();
  const { t } = useTranslation();
  useEffect(() => {
    if (authLogged) {
      navigate('/home');
    }
  }, []);

  const onSubmitForm = async (values: LoginReq) => {
    setLoading(true);

    try {
      const res = await loginApi(values);
      if (res) {
        await destroyLogged();
        saveToken(res.jwt.accessToken);
        saveRefreshToken(res.jwt.refreshToken);
        saveUserInfor(res.user);
        navigate('/home');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div className="bg-[#FAFAFA] font-sans ">
      <div className="flex  flex-row pl-32 pt-10 pb-[71px] ">
        <div className="w-1/2">
          <div>
            <img src={logoImage} alt="logo" className="w-56" />
          </div>
          <div>
            <div className=" color-primary font-medium text-[70px] mt-10 mb-6 leading-[90px]">
              Welcome to <br />
              Enterprise Data &<br />
              Analytics Division
            </div>
            <div className="text-[#525252] text-[21px] font-normal">{t('login.txt_innovation')}</div>
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="normal_login"
              className=" mt-10"
              onFinish={onSubmitForm}
            >
              <Form.Item
                name="identifier"
                // rules={[
                //   { required: true, message: ERROR_CODE.A001 },
                //   { type: 'email', message: ERROR_CODE.A002 },
                // ]}
                className="border-[#EEEEEE] rounded-[30px] w-[360px] bg-white py-2 px-6 mb-4"
              >
                <div className="flex flex-row gap-[5px]">
                  <img src={emailIcon} alt="email" />
                  <Input
                    placeholder="Email"
                    className="w-[276px] h-[25px] border-none shadow-none hover:shadow-none p-0"
                  />
                </div>
              </Form.Item>
              <Form.Item
                name="password"
                //  rules={[{ required: true, message: ERROR_CODE.A001 }]}
                className="border-[#EEEEEE] rounded-[30px] w-[360px] bg-white py-2 px-6 mb-4"
              >
                <div className="flex flex-row gap-[5px]">
                  <img src={passwordIcon} alt="email" />
                  <Input.Password
                    type="password"
                    placeholder="Password"
                    className="w-[276px] h-[25px] border-none shadow-none hover:shadow-none p-0"
                  />
                </div>
              </Form.Item>
              <Form.Item name="remember_me" valuePropName="checked" noStyle>
                <Checkbox>
                  <p className="text-[#25282B] text-sm font-normal">{t('login.txt_remember')}</p>
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <button type="submit" className="btn-primary w-[167px] h-[40px] mt-6">
                  {t('login.btn_login')}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="flex w-1/2">
          <img src={placehlderImage} alt="image_placehlder_1" className="w-2/3 h-fit mx-auto my-auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

import { Button } from 'antd';
import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import iconBack from 'assets/icons/icon_back.svg';
import { Link, useNavigate } from 'react-router-dom';
import './buttonBackPage.scss';
import { useTranslation } from 'react-i18next';
const ButtonBackPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      {/* <Link> */}
      <Button onClick={() => navigate(-1)} className="border-none-imp btn-backpage ml-6 ">
        <img src={iconBack} alt="icon_back" />{' '}
        <span className="text-[16px] text-[#1D4289] font-medium ">{t('common.btn_back')}</span>
      </Button>
      {/* </Link> */}
    </div>
  );
};

export default ButtonBackPage;

import { useTranslation } from 'react-i18next';
import { CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import botImage from 'assets/images/bot-image.svg';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { APP_CONFIG } from 'utils/env';
const Footer = () => {
  const { t } = useTranslation();
  const [showChat, setShowChat] = useState<boolean>(false);
  const [zoom, setZoom] = useState<boolean>(false);
  return (
    <div>
      {showChat && (
        <div
          className={twMerge(
            'flex flex-col shadow-md rounded-lg bg-white  fixed bottom-[82px] right-[72px] z-[1000] transition-all duration-500 ease-in-out',
            zoom ? 'w-1/2 h-4/5' : 'h-2/3 w-1/4',
          )}
        >
          <div className="h-[5%] flex items-center">
            <div
              className="mr-2 ml-auto cursor-pointer hover:bg-gray-200 hover:rounded-[50%] h-5 w-5 flex justify-center items-center"
              onClick={() => {
                setZoom(!zoom);
              }}
            >
              {!zoom ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
            </div>
            <div
              className="ml-2 mr-2 cursor-pointer hover:bg-gray-200 hover:rounded-[50%] h-5 w-5 flex justify-center items-center "
              onClick={() => {
                setShowChat(!showChat);
                setZoom(false);
              }}
            >
              <CloseOutlined width={'15px'} height={'15px'} />
            </div>
          </div>
          <iframe title="myframe" id="myframe" src={APP_CONFIG.assistantBotUrl} className=" chart-bot-type"></iframe>
        </div>
      )}
      {!showChat && (
        <img
          src={botImage}
          alt="bot-image"
          className="bot-type"
          onClick={() => {
            setShowChat(!showChat);
            setZoom(false);
          }}
        />
      )}

      <div className="bg-primary h-[71px] w-full">{t('footer.txt_copy_right')}</div>
    </div>
  );
};
export default Footer;

import React from 'react';
import { Layout, Tooltip } from 'antd';
import PermissionRoute from '../middleware/PermissionRoute';
import './styles/_sidebar.scss';
import logoWebNoText from 'assets/images/logo-web-no-text.svg';
import avatar from 'assets/images/avatar.png';
import logoutIcon from 'assets/images/logout.svg';
import { logoutApi } from 'pages/auth/api';
import { destroyLogged, getAccessToken, getUserInfor } from 'utils/jwt';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getUserInfor();

  const logout = async () => {
    const accessToken = getAccessToken();
    // if (!accessToken) return navigate('/login');
    await destroyLogged();

    await logoutApi(accessToken || '');

    navigate('/login');
  };

  return (
    <Layout.Sider
      trigger={null}
      collapsed={true}
      className="custom-sider top-0 h-min-full"
      collapsedWidth={80}
      style={{ position: 'fixed', backgroundColor: 'white', minHeight: '100vh', height: 'fit', zIndex: 99 }}
    >
      <div className="flex justify-center logo bg-white  ">
        <img src={logoWebNoText} alt="logo-no-text" className="w-auto h-[18px]" />
      </div>
      <PermissionRoute />
      <Tooltip
        title={
          <div
            className="flex    cursor-pointer rounded-lg h-10  px-2 items-center hover:bg-[#0000000F]"
            onClick={() => logout()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                logout();
              }
            }}
          >
            <img src={logoutIcon} alt="logout" className="h-6 w-6 mr-2" /> <span>Logout</span>
          </div>
        }
        placement="right"
        overlayInnerStyle={{ backgroundColor: '#ffffff', color: '#000', padding: 3 }}
        arrow={false}
      >
        <div
          className=" border-top-icon flex-1 flex pb-auto flex-col bg-white items-center py-4"
          style={{
            marginTop: location.pathname === '/home' ? '352px' : '0px',
          }}
        >
          <img src={avatar} alt="avatar" className="h-10 w-10" />
          <div>
            <div className="text-[#525252] font-bold text-sm m-1 flex justify-center">{user?.email.split('@')[0]}</div>
            {/* <div className="text-[#525252] font-semibold text-[12px] ">Assistant</div> */}
          </div>
        </div>
      </Tooltip>
    </Layout.Sider>
  );
};

export default React.memo(Sidebar);

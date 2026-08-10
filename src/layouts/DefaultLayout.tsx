import React, { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { destroyLogged, getAccessToken, isLogin } from 'utils/jwt';
import moment from 'moment';
import { EventsType, useIdleTimer } from 'react-idle-timer';
import { logoutApi } from 'pages/auth/api';

const Sidebar = React.lazy(() => import('./Sidebar'));
const PermissionContent = React.lazy(() => import('../middleware/PermissionContent'));

// const { Content } = Layout;

const loading = () => <Spin />;

const DefaultLayout = () => {
  const navigate = useNavigate();
  const authLogged = isLogin();

  const timeLogout = 1000 * 60 * 30;

  const onIdle = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return navigate('/login');
    const res = await logoutApi(accessToken);
    if (res) {
      await destroyLogged();
      navigate('/login');
    }
  };

  const onAction = () => {
    localStorage.setItem('timeActive', JSON.stringify(moment().unix() * 1000));
  };

  const events: EventsType[] = [
    'keydown',
    'wheel',
    'DOMMouseScroll',
    'mousewheel',
    'mousedown',
    'touchstart',
    'touchmove',
    'MSPointerDown',
    'MSPointerMove',
    'visibilitychange',
  ];

  const { reset } = useIdleTimer({
    disabled: !authLogged,
    events: events,
    timeout: timeLogout,
    throttle: 500,
    onIdle,
    onAction,
  });

  useEffect((): void => {
    if (!authLogged) {
      navigate('/login');
    } else {
      reset();
    }
  }, []);
  if (!authLogged) {
    return <></>;
  }

  return (
    <Layout className="site-layout  " style={{ height: 'fit', display: 'flex', flexDirection: 'column' }}>
      <Layout style={{ minHeight: 'fit', display: 'flex', flexDirection: 'row' }}>
        <Suspense fallback={loading()}>
          <Sidebar />
        </Suspense>
        <Layout className="main-layout bg-[#FAFAFA]" style={{ height: 'fit' }}>
          {/* <Content className="fixed h-[92px] w-full bg-[#FAFAFA] z-50">
            <Suspense fallback={loading()}>
              <Header />
            </Suspense>
          </Content> */}
          {/* <Content
            style={{ overflow: 'initial' }}
            className="bg-main relative min-h-[calc(100vh-92px)] mt-[92px] max-w-[calc(100vw-80px)] ml-20 "
          >
            <Suspense fallback={loading()}>
              <PermissionContent />
            </Suspense>
          </Content> */}
          <PermissionContent />
        </Layout>
      </Layout>
      {/* <Suspense fallback={loading()}>
        <Footer />
      </Suspense> */}
    </Layout>
  );
};

export default DefaultLayout;

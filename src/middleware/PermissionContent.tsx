import React, { Suspense } from 'react';
// import * as AUTH from 'pages/auth/store/Constants';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import routes from './../routes/routes';
import { RouteProps } from 'store/common/interface';
import { Content } from 'antd/es/layout/layout';
const Header = React.lazy(() => import('../layouts/Header'));
const Footer = React.lazy(() => import('../layouts/Footer'));
const PermissionContent = () => {
  return (
    <Routes>
      {routes.map((route: RouteProps, idx: number) => {
        return (
          route.component && (
            <Route
              key={idx}
              path={route.path}
              element={
                <Suspense fallback={<Spin />}>
                  <Content className="fixed h-[92px] w-full bg-[#FAFAFA] z-50">
                    <Suspense fallback={<Spin />}>
                      <Header />
                    </Suspense>
                  </Content>
                  <Content
                    style={{ overflow: 'initial' }}
                    className="bg-main relative min-h-[calc(100vh-92px)] mt-[92px] max-w-[calc(100vw-80px)] ml-20 "
                  >
                    <Suspense fallback={<Spin />}>
                      <route.component />
                    </Suspense>
                  </Content>
                  <Suspense fallback={<Spin />}>
                    <Footer />
                  </Suspense>
                </Suspense>
              }
            />
          )
        );
      })}
    </Routes>
  );
};

export default PermissionContent;

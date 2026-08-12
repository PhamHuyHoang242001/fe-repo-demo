import React from 'react';
import { ConfigProvider } from 'antd';
import { MotionConfig } from 'framer-motion';
import RequireAuth from './guard/RequireAuth';
import AssetHubLayout from './layout/AssetHubLayout';
import AssetHubRoutes from './routes';
import { AH_ANTD_THEME } from './theme/antd-theme';

// Entry của isolated module asset-hub. Mount tại App.tsx dạng /asset-hub/*.
// ConfigProvider themes every antd control (Select/Input/Modal…) to the ah-* palette;
// MotionConfig reducedMotion="user" makes all framer-motion animations respect the OS setting.
const AssetHubApp: React.FC = () => (
  <ConfigProvider theme={AH_ANTD_THEME}>
    <MotionConfig reducedMotion="user">
      <RequireAuth>
        <AssetHubLayout>
          <AssetHubRoutes />
        </AssetHubLayout>
      </RequireAuth>
    </MotionConfig>
  </ConfigProvider>
);

export default AssetHubApp;

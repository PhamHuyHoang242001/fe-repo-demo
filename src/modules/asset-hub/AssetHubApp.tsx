import React from 'react';
import RequireAuth from './guard/RequireAuth';
import AssetHubLayout from './layout/AssetHubLayout';
import AssetHubRoutes from './routes';

// Entry của isolated module asset-hub. Mount tại App.tsx dạng /asset-hub/*.
const AssetHubApp: React.FC = () => (
  <RequireAuth>
    <AssetHubLayout>
      <AssetHubRoutes />
    </AssetHubLayout>
  </RequireAuth>
);

export default AssetHubApp;

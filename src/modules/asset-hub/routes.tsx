import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SkillPackage from './pages/skill/SkillPackage';
import SkillDetail from './pages/skill/SkillDetail';
import PromptLibrary from './pages/PromptLibrary';

// Bảng route nội bộ module (relative — mount dưới /asset-hub/* ở App.tsx).
// IMPORTANT: `skill/:id` must be a TOP-LEVEL SIBLING before the catch-all.
//   If nested under the leaf `skill` route, react-router would only match when
//   the parent SkillPackage renders an <Outlet>, which it does not (it's a shell,
//   not a layout). Placing it here as a sibling means /skill/123 matches before
//   the catch-all `*` redirects it away.
const AssetHubRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Dashboard />} />
    <Route path="skill" element={<SkillPackage />} />
    <Route path="skill/:id" element={<SkillDetail />} />
    <Route path="prompt" element={<PromptLibrary />} />
    <Route path="*" element={<Navigate to="." replace />} />
  </Routes>
);

export default AssetHubRoutes;

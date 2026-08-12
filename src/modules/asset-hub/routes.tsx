import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SkillPackage from './pages/skill/SkillPackage';
import SkillDetail from './pages/skill/SkillDetail';
import SkillForm from './pages/skill/SkillForm';
import PromptLibrary from './pages/PromptLibrary';
import PromptDetail from './pages/prompt/PromptDetail';
import PromptForm from './pages/prompt/PromptForm';

// Bảng route nội bộ module (relative — mount dưới /asset-hub/* ở App.tsx).
// IMPORTANT: all `skill/*` routes are TOP-LEVEL SIBLINGS before the catch-all.
//   SkillPackage is a shell (no <Outlet>), so these can't be nested children.
//   React-Router v6 ranks static segments (`skill/upload`) and static tails
//   (`skill/:id/edit`) ABOVE the bare `skill/:id`, so declaration order doesn't
//   matter between them — they only need to precede the `*` catch-all (otherwise
//   `/skill/upload` would fall through to SkillDetail → Number("upload")=NaN → 404).
const AssetHubRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Dashboard />} />
    <Route path="skill" element={<SkillPackage />} />
    <Route path="skill/upload" element={<SkillForm mode="new" />} />
    <Route path="skill/:id/edit" element={<SkillForm mode="edit" />} />
    <Route path="skill/:id" element={<SkillDetail />} />
    <Route path="prompt" element={<PromptLibrary />} />
    <Route path="prompt/upload" element={<PromptForm mode="new" />} />
    <Route path="prompt/:id/edit" element={<PromptForm mode="edit" />} />
    <Route path="prompt/:id" element={<PromptDetail />} />
    <Route path="*" element={<Navigate to="." replace />} />
  </Routes>
);

export default AssetHubRoutes;

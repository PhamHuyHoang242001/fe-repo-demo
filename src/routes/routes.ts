// import { KEY } from 'store/common/constants';
import About from 'pages/about/About';
import PropensityModel from 'pages/aiHub/aiModel/propensityModel/views/PropensityModel';
import React from 'react';
// import PermissionData from './middleware/PermissionData'
const Home = React.lazy(() => import('pages/home/views/Home'));
const Upcomming = React.lazy(() => import('pages/upcomming/Upcomming'));
const Innovation = React.lazy(() => import('pages/innovation/views/Innovation'));
const Dashboard = React.lazy(() => import('pages/innovation/dashboard/views/Dashboard'));
const AIModel = React.lazy(() => import('pages/aiHub/aiModel/views/AIModel'));
const AIApp = React.lazy(() => import('pages/aiHub/aiApp/views/AIApp'));
const AppDetail = React.lazy(() => import('pages/aiHub/aiApp/groupApp/appDetail/views/appDetail'));
const GroupApp = React.lazy(() => import('pages/aiHub/aiApp/groupApp/views/GroupApp'));
const GenerativeAI = React.lazy(() => import('pages/aiHub/generativeAI/views/GenerativeAI'));

const routes = [
  { path: '/home', exact: true, name: 'Home', component: Home },
  { path: '/home/ai-hub/model', exact: true, name: 'AI/ML models', component: AIModel },
  {
    path: '/home/ai-hub/model/:document_id',
    exact: true,
    name: 'Propensity Model',
    component: PropensityModel,
  },
  { path: '/home/ai-hub/app', exact: true, name: 'AI Apps', component: AIApp },
  { path: '/home/ai-hub/app/all-app/:document_id', exact: true, name: 'App Detail', component: AppDetail },
  { path: '/home/ai-hub/app/all-app', exact: true, name: 'App Detail', component: GroupApp },
  { path: '/home/ai-hub/generative-ai', exact: true, name: 'Generative AI', component: GenerativeAI },
  { path: '/home/bi-hub/descriptive', exact: true, name: 'Descriptive Analytics', component: Upcomming },
  { path: '/home/bi-hub/diagnostic', exact: true, name: 'Diagnostic Analytics', component: Upcomming },
  { path: '/home/bi-hub/kpi-incentive', exact: true, name: 'KPI & Incentive', component: Upcomming },
  { path: '/home/ecosystem/customer', exact: true, name: 'Ecosystem', component: Upcomming },
  { path: '/home/ecosystem/analytics', exact: true, name: 'Ecosystem', component: Upcomming },
  { path: '/home/ecosystem/governance', exact: true, name: 'Ecosystem', component: Upcomming },
  { path: '/home/data-hub/architect', exact: true, name: 'Data Hub', component: Upcomming },
  { path: '/home/data-hub/engineering', exact: true, name: 'Data Hub', component: Upcomming },
  { path: '/home/data-hub/product', exact: true, name: 'Data Hub', component: Upcomming },
  { path: '/home/governance/data-governance', exact: true, name: 'Governance', component: Upcomming },
  { path: '/home/governance/quality', exact: true, name: 'Governance', component: Upcomming },
  { path: '/home/governance/analytics-governance', exact: true, name: 'Governance', component: Upcomming },
  { path: '/home/strategy-innovation/innovation', exact: true, name: 'Innovation', component: Innovation },
  {
    path: '/home/strategy-innovation/innovation/:document_id',
    exact: true,
    name: 'Winnovate 2024',
    component: Dashboard,
  },
  { path: '/home/strategy-innovation/development', exact: true, name: 'People Development', component: Upcomming },
  { path: '/home/strategy-innovation/events', exact: true, name: 'EDA Events', component: Upcomming },
  { path: '/home/about', exact: true, name: 'About', component: About },
  { path: '/home/notification', exact: true, name: 'Notifications', component: Upcomming },
  { path: '/home/setting', exact: true, name: 'Settings', component: Upcomming },
];
export default routes;

import home from 'assets/images/home.svg';
import aiHub from 'assets/images/ai_hub.svg';
import biHub from 'assets/images/bi_hub.svg';
import ecosystem from 'assets/images/ecosystem.svg';
import dataHub from 'assets/images/data_hub.svg';
import governance from 'assets/images/governance.svg';
import strategyInnovation from 'assets/images/strategy_innovation.svg';
import about from 'assets/images/about.svg';
import notification from 'assets/images/notification.svg';
import setting from 'assets/images/setting.svg';
import { Children } from 'react';

export default {
  items: [
    {
      id: 1,
      name: 'Home',
      isEnable: false,
      url: '/home',
      isShow: true,
      icon: <img src={home} alt="home" />,
    },
    {
      id: 2,
      name: 'Ai Hub',
      isEnable: false,
      isShow: true,
      url: '/ai-hub',
      children: [
        { id: 11, name: 'AI/ML models', url: '/home/ai-hub/model', isShow: true, icon: null },
        { id: 12, name: 'AI Apps', url: '/home/ai-hub/app', isShow: true, icon: null },
        {
          id: 13,
          name: 'Generative AI',
          url: '/home/ai-hub/generative-ai',
          isShow: true,
          icon: null,
        },
      ],
      icon: <img src={aiHub} alt="ai-hub" />,
    },
    {
      id: 3,
      name: 'Bi Hub',
      isEnable: false,
      url: '/bi-hub',
      isShow: false,
      children: [
        { id: 14, name: 'Descriptive Analytics', url: '/home/bi-hub/descriptive', isShow: false, icon: null },
        { id: 15, name: 'Diagnostic Analytics', url: '/home/bi-hub/diagnostic', isShow: false, icon: null },
        {
          id: 16,
          name: 'KPI & Incentive',
          url: '/home/bi-hub/kpi-incentive',
          isShow: false,
          icon: null,
        },
      ],
      icon: <img src={biHub} alt="bi-hub" />,
    },
    {
      id: 4,
      name: 'Ecosystem',
      isEnable: false,
      url: '/ecosystem',
      isShow: false,
      children: [
        { id: 17, name: 'Customer 360', url: '/home/ecosystem/customer', isShow: false, icon: null },
        { id: 18, name: 'Ecosystem Analytics', url: '/home/ecosystem/analytics', isShow: false, icon: null },
        {
          id: 19,
          name: 'Ecosystem Governance',
          url: '/home/ecosystem/governance',
          isShow: false,
          icon: null,
        },
      ],
      icon: <img src={ecosystem} alt="ecosystem" />,
    },
    {
      id: 5,
      name: 'Data Hub',
      isEnable: false,
      isShow: false,
      url: '/data-hub',
      children: [
        { id: 20, name: 'Data Architect', url: '/home/data-hub/architect', isShow: false, icon: null },
        { id: 21, name: 'Data Engineering', url: '/home/data-hub/engineering', isShow: false, icon: null },
        {
          id: 22,
          name: 'Data Product',
          url: '/home/data-hub/product',
          isShow: false,
          icon: null,
        },
      ],
      icon: <img src={dataHub} alt="data-hub" />,
    },
    {
      id: 6,
      name: 'Governance',
      isEnable: false,
      isShow: false,
      url: '/governance',
      children: [
        { id: 23, name: 'Data Governance', url: '/home/governance/data-governance', isShow: false, icon: null },
        { id: 24, name: 'Data Quality', url: '/home/governance/quality', isShow: false, icon: null },
        {
          id: 25,
          name: 'Analytics Governance',
          url: '/home/governance/analytics-governance',
          isShow: false,
          icon: null,
        },
      ],
      icon: <img src={governance} alt="governance" />,
    },
    {
      id: 7,
      name: 'Strategy & Innovation',
      isEnable: false,
      isShow: true,
      url: '/strategy-innovation',
      children: [
        { id: 26, name: 'Innovation', url: '/home/strategy-innovation/innovation', isShow: true, icon: null },
        { id: 27, name: 'People Development', url: '/home/strategy-innovation/development', isShow: false, icon: null },
        {
          id: 28,
          name: 'EDA Events',
          url: '/home/strategy-innovation/events',
          isShow: false,
          icon: null,
        },
      ],
      icon: <img src={strategyInnovation} alt="strategy-innovation" />,
    },
    { id: 8, name: 'About', isEnable: true, isShow: true, url: '/home/about', icon: <img src={about} alt="about" /> },
    {
      id: 9,
      name: 'Notifications',
      isEnable: true,
      isShow: false,
      url: '/home/notification',
      icon: <img src={notification} alt="notification" />,
    },
    {
      id: 10,
      name: 'Settings',
      isEnable: false,
      isShow: false,
      url: '/home/setting',
      icon: <img src={setting} alt="setting" />,
    },
  ],
};

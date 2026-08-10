import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HubItem from '../components/HubItem';
import HubItemHover from '../components/HubItemHover';
import iconAIHub from 'assets/icons/icon_ai_hub_home.svg';
import iconBIHub from 'assets/icons/icon_bi_hub_home.svg';
import iconDataHub from 'assets/icons/icon_data_hub_home.svg';
import iconEcosystem from 'assets/icons/icon_ecosystem_home.svg';
import iconGovernance from 'assets/icons/icon_governance_home.svg';
import iconInnovation from 'assets/icons/icon_innovation_home.svg';
interface HubItemType {
  name: string;
  isShow: boolean;
  icon: string;
  children: Array<any>;
}
const Home: React.FC = (): JSX.Element => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const items = [
    {
      name: 'AI Hub',
      icon: iconAIHub,
      isShow: true,
      children: [
        { name: 'AI/ML models', url: '/home/ai-hub/model', isShow: true },
        { name: 'AI Apps', url: '/home/ai-hub/app', isShow: true },
        { name: 'Generative AI', url: '/home/ai-hub/generative-ai', isShow: true },
      ],
    },
    {
      name: 'BI Hub',
      icon: iconBIHub,
      isShow: false,
      children: [
        { name: 'Descriptive Analytics', url: '/home/bi-hub/descriptive' },
        { name: 'Diagnostic Analytics', url: '/home/bi-hub/diagnostic' },
        { name: 'KPI & Incentive', url: '/home/bi-hub/kpi-incentive' },
      ],
    },
    {
      name: 'Ecosystem',
      icon: iconEcosystem,
      isShow: false,
      children: [
        { name: 'Customer 360', url: '/home/ecosystem/customer' },
        { name: 'Ecosystem Analytics', url: '/home/ecosystem/analytics' },
        { name: 'Ecosystem Governance', url: '/home/ecosystem/governance' },
      ],
    },
    {
      name: 'Data Hub',
      icon: iconDataHub,
      isShow: false,
      children: [
        { name: 'Data Architect', url: '/home/data-hub/architect' },
        { name: 'Data Engineering', url: '/home/data-hub/engineering' },
        { name: 'Data Product', url: '/home/data-hub/product' },
      ],
    },
    {
      name: 'Governance',
      icon: iconGovernance,
      isShow: false,
      children: [
        { name: 'Data Governance', url: '/home/governance/data-governance' },
        { name: 'Data Quality', url: '/home/governance/quality' },
        { name: 'Analytics Governance', url: '/home/governance/analytics-governance' },
      ],
    },
    {
      name: 'Strategy & Innovation',
      icon: iconInnovation,
      isShow: true,
      children: [
        { name: 'Innovation', url: '/home/strategy-innovation/innovation', isShow: true },
        { name: 'People Development', url: '/home/strategy-innovation/development' },
        { name: 'EDA Events', url: '/home/strategy-innovation/events' },
      ],
    },
  ];
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-bold text-[40px] color-primary flex justify-center my-6 2xl:my-10">
        {t('home.txt_funtion')}
      </div>
      <div className="flex justify-items-center ">
        <div className=" grid md:grid-cols-3  gap-8 mx-auto 2xl:gap-14">
          {items?.map((item: HubItemType) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {hoveredItem === item.name ? (
                <HubItemHover name={item.name} icon={item.icon} childrens={item.children} />
              ) : (
                <HubItem name={item.name} icon={item.icon} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

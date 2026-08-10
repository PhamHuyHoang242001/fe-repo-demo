import React from 'react';
import { useNavigate } from 'react-router';
import '../styles/aiModel.scss';
import impactIcon from 'assets/icons/impact_icon.svg';
import purposeIcon from 'assets/icons/purpose_icon.svg';
import { useTranslation } from 'react-i18next';

interface AIModelItemProps {
  id: string;
  name: string;
  image: string;
  purpose: string;
  impact: string;
  document_id: string;
}

const AIModelItem = ({ name, image, purpose, id, impact, document_id }: AIModelItemProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className=" ai-model-item flex flex-col w-[353.11px] h-[408px]  cursor-pointer shadow-hover-item "
      onClick={() => {
        navigate(`/home/ai-hub/model/${document_id}`);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/home/ai-hub/model/${document_id}`);
        }
      }}
    >
      <div className=" h-[185px] w-[full] flex justify-center items-center">
        <img src={image} alt="ai-model-ex" className="rounded-tr-[10px] rounded-tl-[10px] overflow-hidden" />
      </div>
      <div className="px-[14px]">
        <div className="text-[16px] font-bold color-primary mt-2 mb-3">{name}</div>
        <div className=" flex flex-col text-sm text-[#25282B] leading-[18px]">
          <div
            className="flex flex-row h-[78px] gap-2 pb-1"
            style={{
              borderBottom: '1px solid #E6EFF5',
            }}
          >
            <img src={purposeIcon} alt="icon" className="w-[45px] h-[45px]" />
            <div className="flex flex-col">
              <div className="font-bold mr-2">{t('ai_models.txt_purpose')}</div>
              <div className="font-normal limit-lines ">{purpose}</div>
            </div>
          </div>
          <div
            className="flex flex-row h-[78px] gap-2 mt-2 pb-1"
            style={{
              borderBottom: '1px solid #E6EFF5',
            }}
          >
            <img src={impactIcon} alt="icon" className="w-[45px] h-[45px]" />
            <div className="flex flex-col">
              <div className="font-bold mr-2">{t('ai_models.txt_impact')}</div>
              <div className="font-normal limit-lines ">{impact}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelItem;

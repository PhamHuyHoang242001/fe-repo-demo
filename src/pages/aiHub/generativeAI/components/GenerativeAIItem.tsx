import React from 'react';
import '../styles/generativeAi.scss';
import { twMerge } from 'tailwind-merge';

interface GenerativeAIItemProps {
  name: string;
  logo: string;
  short_desc: string;
  ref_url?: string;
  handleShowBot: (url: string) => void;
}

const GenerativeAIItem = ({ name, logo, short_desc, handleShowBot, ref_url }: GenerativeAIItemProps) => {
  return (
    <div
      className={twMerge(
        'shadow-generative-item flex flex-col w-[233px] h-[230px]  rounded-lg bg-white ',
        ref_url && ref_url !== '#' ? 'cursor-pointer' : 'cursor-not-allowed',
      )}
      onClick={() => {
        if (ref_url && ref_url !== '#') {
          handleShowBot(ref_url);
        }
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (ref_url && ref_url !== '#') {
            handleShowBot(ref_url);
          }
        }
      }}
    >
      <img src={logo} alt="generative_ai_icon" width={'56px'} height={'46px'} className="mt-6 ml-4 mb-9" />
      <div className="px-6">
        <div className="text-[21px] color-primary font-normal leading-[32px]">{name}</div>
        <div className="text-[#52525B] text-xs font-normal mt-1">{short_desc}</div>
      </div>
    </div>
  );
};

export default GenerativeAIItem;

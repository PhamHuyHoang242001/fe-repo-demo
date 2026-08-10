import React from 'react';
import { useTranslation } from 'react-i18next';

const Upcomming: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className=" h-full w-full flex">
      <div className="text-black text-3xl font-bold mx-auto my-auto">Comming soon ...</div>
    </div>
  );
};

export default Upcomming;

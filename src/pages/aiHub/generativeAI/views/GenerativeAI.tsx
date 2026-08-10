import React, { useEffect, useState } from 'react';
import GenerativeAIItem from '../components/GenerativeAIItem';
import VpbankDiamondIcon from 'assets/icons/vpbank_diamond_icon.svg';
import { getAllGeneratives } from '../api';
import { GenerativeModelReq, SortType } from '../../../../types/aiHub/index';
import { Modal } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from 'utils/env';
interface GenerativeAIItemProps {
  name: string;
  image?: string;
  url: string;
  short_desc: string;
  ref_url?: string;
}

const GenerativeAI: React.FC = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search')?.toString() || '';
  const [generatives, setGeratives] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlBot, setUrlBot] = useState<string>('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleShowBot = (url: string) => {
    setUrlBot(url);

    showModal();
  };

  const featchGeneratives = () => {
    const params: GenerativeModelReq = {
      sortField: 'created_at',
      sortValue: SortType.ASC,
      limit: 10,
      page: 1,
      keyword: searchValue || '',
    };
    getAllGeneratives(params)
      .then((res: any) => {
        setGeratives(res?.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    featchGeneratives();
  }, [searchValue]);

  return (
    <div className="flex justify-items-center my-6">
      <div className="flex flex-wrap justify-center gap-5 max-w-[1000px] mx-auto">
        {generatives?.map((item: GenerativeAIItemProps) => (
          <GenerativeAIItem
            key={item.name}
            name={item.name}
            handleShowBot={handleShowBot}
            logo={APP_CONFIG.imageMediaUrl + item?.url || VpbankDiamondIcon}
            short_desc={item.short_desc}
            ref_url={item?.ref_url ? item?.ref_url : ''}
          />
        ))}
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'1050px'}
        footer={null}
        className="modal-detail-propensity"
      >
        <div className="h-[600px] px-5">
          <iframe title="myframe" id="myframe" src={urlBot} className=" chart-bot-type"></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default GenerativeAI;

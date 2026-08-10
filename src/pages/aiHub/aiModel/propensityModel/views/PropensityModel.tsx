import React, { useEffect, useState } from 'react';
import PropensityModelItem from '../components/PropensityModelItem';
import PropensityIcon from 'assets/icons/propensity_icon.svg';
import { getAllPropensityModelByAIModel } from '../api';
import PaginationComponent from 'components/pagination/PaginationComponent';
import { PropensityModelReq, SortType } from '../../../../../types/aiHub/index';
import { listStatus } from 'utils/constants';
import { useParams, useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from 'utils/env';
import ModalDetail from 'components/modalDetail/ModalDetail';
interface PropensityModelProps {
  name: string;
  bu: string;
  icon?: string;
  url?: string;
  pdf_url: string;
  scope: string;
  impact: string;
  po: string;
  prosensity_status: string;
  id: number;
}

const PropensityModel: React.FC = (): JSX.Element => {
  const { document_id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search')?.toString() || '';
  const [propensityModels, setPropensityModels] = useState<any>([]);
  const [itemViewMore, setItemViewMore] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const featchPropensityModelByAIModels = () => {
    const params: PropensityModelReq = {
      page: currentPage,
      limit: pageSize,
      sortField: 'created_at',
      sortValue: SortType.ASC,
      keyword: searchValue || '',
    };

    getAllPropensityModelByAIModel(document_id, params)
      .then((res: any) => {
        setPropensityModels(res?.data);
        setTotal(res?.meta.totalItem);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);
  useEffect(() => {
    featchPropensityModelByAIModels();
  }, [currentPage, pageSize, searchValue]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  const handleShowMore = (id: number) => {
    const x = propensityModels?.find((item: PropensityModelProps) => item.id === id);
    setItemViewMore(x);

    showModal();
  };

  return (
    <div className="flex h-full pb-20 flex-col justify-between">
      <div className="flex flex-wrap w-[1264px]  gap-4 mx-auto">
        {propensityModels?.map((item: PropensityModelProps, index: number) => (
          <PropensityModelItem
            key={index}
            handleShowMore={handleShowMore}
            name={item.name}
            icon={APP_CONFIG.imageMediaUrl + item?.url || PropensityIcon}
            bu={item.bu}
            pdf_url={item.pdf_url ? APP_CONFIG.imageMediaUrl + item.pdf_url : ''}
            scope={item.scope}
            status={item.prosensity_status}
            impact={JSON.parse(item.impact)}
            po={item.po}
            id={item.id}
          />
        ))}
      </div>
      <div className="flex flex-row mx-auto left-[40%] absolute bottom-6 ">
        <PaginationComponent
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
      <ModalDetail
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        url={itemViewMore?.url ? APP_CONFIG.imageMediaUrl + itemViewMore?.url : ''}
        pdf_url={itemViewMore?.pdf_url ? APP_CONFIG.imageMediaUrl + itemViewMore?.pdf_url : ''}
        name={itemViewMore?.name}
        bu={itemViewMore?.bu}
        po={itemViewMore?.po}
        scope={itemViewMore?.scope}
        status={listStatus.get(itemViewMore?.prosensity_status)?.name || ''}
        impact={JSON.parse(itemViewMore?.impact || '{}')}
      />
    </div>
  );
};

export default PropensityModel;

import { Button, Select } from 'antd';
import PaginationComponent from 'components/pagination/PaginationComponent';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { bookMarkAIAppById, getAllAIApp, getAllCategoryAIApp, likeAIAppById } from '../api';
import { AIAppReq } from '../../../../../types/aiHub/index';
import { useLocation, useSearchParams } from 'react-router-dom';
import AppItem from '../../components/AppItem';
import ModalDetail from 'components/modalDetail/ModalDetail';
import { APP_CONFIG } from 'utils/env';
import { ListSortBy } from 'utils/constants';
import iconBookMarkSaved from 'assets/icons/icon_bookmark_saved.svg';
import iconBookmark from 'assets/icons/icon_bookmark.svg';
interface AIAppProps {
  name: string;
  short_desc: string;
  bu: string;
  icon?: string;
  url: string;
  pdf_url: string;
  total_like: string | null;
  total_quantity_used: string | null;
  scope: string;
  impact: string;
  po: string;
  prosensity_status: string;
  id: number;
  document_id: string;
  is_save_bookmark: boolean | null;
  is_like: boolean | null;
}

const GroupApp = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search')?.toString() || '';

  const [category, setCategory] = useState(location.state?.document_id ? location.state?.document_id : '');
  const [listApps, setListApps] = useState<any>([]);
  const [listCategories, setListCategories] = useState<any>([]);
  const [sortBy, setSortBy] = useState('3');
  const [saveList, setSaveList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemViewMore, setItemViewMore] = useState<any>(null);

  const listSortBy = [
    { value: '1', label: 'Name (A-Z)' },
    { value: '2', label: 'Name (Z-A)' },
    { value: '3', label: 'Newest Time' },
    { value: '4', label: 'Oldest Time' },
    { value: '5', label: 'Most Likes' },
    { value: '6', label: 'Least Likes' },
  ];

  const FeatchGetAllAIApp = () => {
    const params: AIAppReq = {
      page: currentPage,
      limit: pageSize,
      sortField: ListSortBy.get(sortBy)?.sortField || '',
      sortValue: ListSortBy.get(sortBy)?.sortValue || '',
      categoryDocumentId: category,
      keyword: searchValue || '',
      isSaveBookmark: saveList ? 1 : 0,
    };

    getAllAIApp(params)
      .then((res: any) => {
        setListApps(res?.data);
        setTotal(res?.meta.totalItem);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllCategoryAIApp()
      .then((res: any) => {
        const y: any = res?.data.map((item: any) => ({
          value: item.document_id,
          label: item.name,
        }));
        setListCategories([{ value: '', label: 'All' }, ...y]);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    FeatchGetAllAIApp();
  }, [category, sortBy, saveList, currentPage, pageSize, searchValue]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleLike = async (document_id: string, is_like: boolean | null) => {
    const apps = listApps?.map((app: any) => {
      if (app.document_id === document_id) {
        return {
          ...app,
          total_like: is_like ? app.total_like - 1 : app.total_like + 1,
          is_like: !is_like,
        };
      } else {
        return app;
      }
    });
    setListApps(apps);

    likeAIAppById(document_id, is_like)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const handleBookMark = async (document_id: string, is_save_bookmark: boolean | null) => {
    bookMarkAIAppById(document_id, !is_save_bookmark ? true : false)
      .then((res: any) => {
        console.log(res);
        FeatchGetAllAIApp();
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleShowMore = (id: number) => {
    const x = listApps?.find((item: AIAppProps) => item.id === id);
    setItemViewMore(x);

    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col px-11 h-full  pb-20">
      <div className="flex flex-row justify-between py-5">
        <div className="text-[#0F172A] text-2xl font-bold">All Apps</div>
        <div className="flex flex-row gap-8">
          <Button
            className={twMerge('w-[120px] h-[30px] ', saveList ? 'bg-[#4096ff] text-white' : 'bg-white')}
            onClick={() => {
              setSaveList(!saveList);
              setCurrentPage(1);
            }}
          >
            {t('ai_app.txt_saved_list')}{' '}
            <img
              src={saveList ? iconBookMarkSaved : iconBookmark}
              alt="bookmark-icon"
              height={'16px'}
              width={'auto'}
              className="ml-2"
            />
          </Button>
          <div>
            <span className="text-black text-sm">Categories:</span>
            <Select
              className="w-[120px] h-[30px] ml-2"
              options={listCategories}
              value={category}
              onChange={(e) => {
                setCategory(e);
                setCurrentPage(1);
              }}
            ></Select>
          </div>
          <div>
            <span className="text-black text-sm">Sort by:</span>
            <Select
              className="w-[120px] h-[30px] ml-2"
              options={listSortBy}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e);
                setCurrentPage(1);
              }}
            ></Select>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-[1164px]  gap-6 mx-auto mt-3">
        {listApps?.map((app: AIAppProps) => (
          <AppItem
            key={app.id}
            handleLike={handleLike}
            handleBookMark={handleBookMark}
            handleShowMore={handleShowMore}
            image={app.url ? APP_CONFIG.imageMediaUrl + app.url : ''}
            name={app.name}
            short_description={app.short_desc}
            id={app.id}
            is_save_bookmark={app.is_save_bookmark}
            is_like={app.is_like}
            total_like={app.total_like}
            total_quantity_used={app.total_quantity_used}
            document_id={app.document_id}
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
        status={''}
        impact={JSON.parse(itemViewMore?.impact || '{}')}
      />
    </div>
  );
};
export default GroupApp;

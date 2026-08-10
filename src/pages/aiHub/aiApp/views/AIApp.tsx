import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
import aiAppUsingIcon from 'assets/icons/ai_app_using_icon.svg';
import arrowRightBlue from 'assets/icons/arrow-right_blue.svg';
import pdfToolImg from 'assets/images/pdf_tools_img.png';
import AppItem from '../components/AppItem';
import '../styles/aiApp.scss';
import ModalDetail from 'components/modalDetail/ModalDetail';
import { useEffect, useState } from 'react';
import { listStatus } from 'utils/constants';
import iconApp from 'assets/icons/icon_app.svg';
import { useNavigate } from 'react-router';
import { bookMarkAIAppById, getAllAIApp, getAllCategoryAIApp, likeAIAppById } from '../groupApp/api';
import { APP_CONFIG } from 'utils/env';
import { AIAppReq, SortType } from '../../../../types/aiHub/index';

interface AIAppProps {
  name: string;
  short_desc: string;
  bu: string;
  icon?: string;
  url: string;
  pdf_url: string;
  scope: string;
  impact: string;
  po: string;
  prosensity_status: string;
  id: number;
  document_id: string;
  is_save_bookmark: boolean | null;
  is_like: boolean | null;
  total_like: string | null;
  total_quantity_used: string | null;
}

const AIApp: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listCategories, setListCategories] = useState<any>([]);
  const [listBookmarks, setListBookmarks] = useState<any>([]);
  const [itemViewMore, setItemViewMore] = useState<any>(null);
  const navigate = useNavigate();
  const FeatchGetAllAIApp = () => {
    const params: AIAppReq = {
      page: 1,
      limit: 30,
      sortField: 'created_at',
      sortValue: SortType.ASC,
      isSaveBookmark: 1,
    };

    getAllAIApp(params)
      .then((res: any) => {
        setListBookmarks(res?.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllCategoryAIApp()
      .then((res: any) => {
        setListCategories(res?.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
    FeatchGetAllAIApp();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleShowMore = (id: number) => {
    const x = listBookmarks?.find((item: AIAppProps) => item.id === id);
    setItemViewMore(x);

    showModal();
  };

  const handleLike = async (document_id: string, is_like: boolean | null) => {
    const apps = listBookmarks?.map((app: any) => {
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
    setListBookmarks(apps);
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
        FeatchGetAllAIApp();
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div
        className="flex flex-row w-full h-[524px]"
        style={{
          borderBottom: '1px solid #E5EAF2',
        }}
      >
        <div className="flex w-1/2 px-[88px] justify-center items-center">
          <div className="flex flex-col w-full ">
            <div className="text-[72px] text-[#0F172A] font-extrabold">{t('ai_app.txt_using')}</div>
            <div className="text-[18px] text-[#475569] mt-6">{t('ai_app.txt_platform')}</div>
          </div>
        </div>
        <div className="flex w-1/2 justify-center items-center">
          <img src={aiAppUsingIcon} alt="ai-app-icon" />
        </div>
      </div>
      <div
        className="pl-20 pr-28 py-10 "
        style={{
          borderBottom: '1px solid #E5EAF2',
        }}
      >
        <div className="text-[40px] text-[#0F172A] font-bold mb-6">{t('ai_app.txt_featured')}</div>
        <Swiper
          rewind={true}
          // navigation={true}
          // modules={[Navigation]}
          // loop={true}
          breakpoints={{
            320: {
              spaceBetween: 24,
            },
          }}
          slidesPerView="auto"
          className="mySwiper"
        >
          {listCategories?.map((item: any) => (
            <SwiperSlide key={item.id} className="h-[260px] cursor-pointer" style={{ width: '218px' }}>
              <img
                src={item.url ? APP_CONFIG.imageMediaUrl + item.url : ''}
                alt="img-remove-background"
                width={'auto'}
                height={'100%'}
                onClick={() => {
                  navigate(`/home/ai-hub/app/all-app`, { state: { document_id: item.document_id } });
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="py-6 pl-20 pr-32">
        <div className="flex flex-row justify-between mb-6">
          <span className="text-[40px] text-[#0F172A] font-bold mb-6">{t('ai_app.txt_saved_list')}</span>
          <div
            className="flex flex-row cursor-pointer"
            onClick={() => {
              navigate(`/home/ai-hub/app/all-app`);
            }}
          >
            <span className="text-[16px] text-[#2563EB] font-medium mr-4">{t('ai_app.txt_more_apps')}</span>
            <img src={arrowRightBlue} alt="arrow-right" width={'24px'} height={'24px'} />
          </div>
        </div>
        <Swiper
          rewind={true}
          // navigation={true}
          // modules={[Navigation]}
          // loop={true}
          breakpoints={{
            320: {
              spaceBetween: 24,
            },
          }}
          slidesPerView="auto"
          className="mySwiper"
        >
          {listBookmarks?.map((item: AIAppProps, index: number) => (
            <SwiperSlide key={index} style={{ width: '345px' }}>
              <AppItem
                handleLike={handleLike}
                handleBookMark={handleBookMark}
                handleShowMore={handleShowMore}
                image={item.url ? APP_CONFIG.imageMediaUrl + item.url : ''}
                name={item.name}
                short_description={item.short_desc}
                id={item.id}
                document_id={item.document_id}
                is_save_bookmark={item.is_save_bookmark}
                is_like={item.is_like}
                total_like={item.total_like}
                total_quantity_used={item.total_quantity_used}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ModalDetail
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        url={itemViewMore?.url ? APP_CONFIG.imageMediaUrl + itemViewMore?.url : ''}
        pdf_url={itemViewMore?.pdf_url}
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
export default AIApp;

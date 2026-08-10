import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import innovationHomeIcon from '../../../assets/icons/innovation_home_icon.svg';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getAllWinnovateCategory } from '../api';
import { SortType } from '../../../types/aiHub/index';
import { APP_CONFIG } from 'utils/env';

const Innovation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [innovationCategory, setInnovationCategory] = useState<any>(null);

  useEffect(() => {
    const params = { page: 1, limit: 30, sortField: 'created_at', sortValue: SortType.ASC };
    getAllWinnovateCategory(params)
      .then((res) => {
        setInnovationCategory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row w-full h-[524px]"
        style={{
          borderBottom: '1px solid #E5EAF2',
        }}
      >
        <div className="flex w-1/2 px-[88px] justify-center items-center">
          <div className="flex flex-col w-full ">
            <div className="text-[72px] text-[#0F172A] font-extrabold">{t('strategy_innovation.txt_unfold')}</div>
            <div className="text-[18px] text-[#475569] mt-6">{t('strategy_innovation.txt_des')}</div>
          </div>
        </div>
        <div className="flex w-1/2 justify-center items-center">
          <img src={innovationHomeIcon} alt="ai-app-icon" />
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
          breakpoints={{
            320: {
              spaceBetween: 24,
            },
          }}
          slidesPerView="auto"
          className="mySwiper"
        >
          {innovationCategory?.map((item: any) => (
            <SwiperSlide
              key={item.id}
              className="cursor-pointer"
              style={{ width: '218px', height: '259px' }}
              onClick={() => {
                navigate(`/home/strategy-innovation/innovation/${item.document_id}`);
              }}
            >
              <img
                src={item.url ? APP_CONFIG.imageMediaUrl + item.url : ''}
                alt="img-remove-background"
                width={'218px'}
                height={'259px'}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
export default Innovation;

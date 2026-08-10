import '../styles/propensityModel.scss';
import clientModalIcon from 'assets/icons/client_modal_icon.svg';
import scopeModalIcon from 'assets/icons/scope_modal_icon.svg';
import exploreIcon from 'assets/icons/explore_icon.svg';
import exploreDisableIcon from 'assets/icons/explore_disable_icon.svg';
import { twMerge } from 'tailwind-merge';
import { listStatus } from 'utils/constants';
import { useTranslation } from 'react-i18next';
interface PropensityModelItemProps {
  name: string;
  handleShowMore: (id: number) => void;
  bu: string;
  icon: string;
  pdf_url: string;
  scope: string;
  impact: any;
  po: string;
  status: string;
  id: number;
}

const PropensityModelItem = ({
  name,
  icon,
  bu,
  scope,
  pdf_url,
  id,
  status,
  handleShowMore,
}: PropensityModelItemProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-propensity-item flex flex-col w-[410px] h-[293px] p-5 relative">
      <div className="flex flex-row  h-[64px] justify-between">
        <div className="flex flex-row gap-3">
          <img src={icon} alt="propensity-model-icon" width={'64px'} height={'64px'} />
          <div className="text-xl font-medium text-[#15202E] my-auto">{name}</div>
        </div>
        <div
          className="w-[111px] h-[26px] flex justify-center items-center font-medium text-white text-sm  rounded-[5px] mt-3 ml-3"
          style={{
            background: listStatus.get(status)?.color,
          }}
        >
          {listStatus.get(status)?.name}
        </div>
      </div>

      <div className="h-[113px]  mt-[27px] flex flex-row">
        <div className="w-[330px] h-full text-sm text-[#000] leading-[24px] ">
          <div className="flex flex-row gap-2">
            <div>
              <img src={clientModalIcon} alt="icon mini" width={'22px'} height={'22px'} />
            </div>
            <div>
              <span className="font-bold mr-2">{t('use_case_models.txt_bu')}</span>
              <span className="font-normal">{bu}</span>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div>
              <img src={scopeModalIcon} alt="icon mini" width={'22px'} height={'22px'} />
            </div>
            <div>
              <span className="font-bold mr-[10px]">{t('use_case_models.txt_scope')}</span>
              <span className="font-normal">{scope}</span>
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <div
            className="text-[#0052B4] text-xs underline cursor-pointer"
            onClick={() => {
              handleShowMore(id);
            }}
          >
            {t('use_case_models.txt_more')}
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          'flex flex-row gap-3 items-center h-[30px] mt-auto',
          pdf_url ? 'cursor-pointer' : 'cursor-not-allowed',
        )}
        onClick={() => {
          if (pdf_url) {
            window.open(pdf_url, '_blank');
          }
        }}
      >
        <img src={pdf_url ? exploreIcon : exploreDisableIcon} alt="explore-icon" width={'30px'} height={'30px'} />
        <span className={twMerge(' text-xs font-normal', pdf_url ? 'color-primary' : 'text-[#CACCCF]')}>
          {t('use_case_models.txt_explore')}
        </span>
      </div>
    </div>
  );
};

export default PropensityModelItem;

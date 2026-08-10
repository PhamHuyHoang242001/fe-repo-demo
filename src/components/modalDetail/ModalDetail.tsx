import { Modal } from 'antd';
import PropensityIcon from 'assets/icons/propensity_icon.svg';
import exploreIcon from 'assets/icons/explore_icon.svg';
import clientModalIcon from 'assets/icons/client_modal_icon.svg';
import scopeModalIcon from 'assets/icons/scope_modal_icon.svg';
import statusModalIcon from 'assets/icons/status_modal_icon.svg';
import impactModalIcon from 'assets/icons/impact_modal_icon.svg';
import poModalIcon from 'assets/icons/po_modal_icon.svg';
import { useTranslation } from 'react-i18next';
interface modalDetailProp {
  isModalOpen: boolean;
  handleCancel: () => void;
  url: string;
  pdf_url: string;
  name: string;
  bu: string;
  scope: string;
  status: string;
  impact: any;
  po: string;
}
const ModalDetail = ({
  isModalOpen,
  handleCancel,
  url,
  pdf_url,
  name,
  bu,
  scope,
  status,
  impact,
  po,
}: modalDetailProp) => {
  const { t } = useTranslation();

  return (
    <Modal open={isModalOpen} onCancel={handleCancel} width={'810px'} footer={null} className="modal-detail-propensity">
      <div className="">
        <div
          className="flex flex-row gap-4 py-4 px-5 relative"
          style={{
            borderBottom: '1px solid #E0E3E6',
          }}
        >
          <img src={url || PropensityIcon} alt="propensity-model-icon" width={'48px'} height={'48px'} />
          {pdf_url && (
            <div
              className="absolute right-12 top-[12px] h-8 w-8 flex justify-center items-center hover:bg-[#0000000F] rounded cursor-pointer"
              onClick={() => {
                window.open(pdf_url, '_blank');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.open(pdf_url, '_blank');
                }
              }}
            >
              <img src={exploreIcon} alt="view-pdf-icon" width={'20px'} height={'20px'} />
            </div>
          )}

          <span className="text-xl font-medium color-black my-auto">{name}</span>
        </div>
        <div className="leading-[24px]  p-5 ">
          <div className="flex flex-row gap-4">
            <div className=" w-12 h-12 flex ">
              <img src={clientModalIcon} alt="icon-client" />
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('use_case_models.txt_bu')}</div>
              <div className="font-normal  text-[16px] text-[#71747B]">{bu}</div>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={scopeModalIcon} alt="icon-client" />
            </div>
            <div className="flex flex-col ">
              <div className="font-medium text-xl text-[#32343A] ">{t('use_case_models.txt_scope')}</div>
              <div className="font-normal text-[16px] text-[#71747B]">{scope}</div>
            </div>
          </div>
          {status && (
            <div className="flex flex-row gap-4 mt-5">
              <div className=" w-12 h-12 flex ">
                <img src={statusModalIcon} alt="icon-client" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-xl text-[#32343A] ">{t('use_case_models.txt_status')}</div>
                <div className="font-normal text-[16px] text-[#71747B]">{status}</div>
              </div>
            </div>
          )}

          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={impactModalIcon} alt="icon-client" />
            </div>

            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('use_case_models.txt_impact')}</div>
              <div className="font-normal text-[16px] text-[#71747B]">
                {impact?.summary}
                <ul className="pl-5">
                  {impact?.items?.map((item: string, index: number) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={poModalIcon} alt="icon-client" />
            </div>

            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('use_case_models.txt_po')}</div>
              <div className="font-normal text-[16px] text-[#71747B]">{po}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalDetail;

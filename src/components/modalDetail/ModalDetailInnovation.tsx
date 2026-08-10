import { Modal } from 'antd';
import PropensityIcon from 'assets/icons/propensity_icon.svg';
import exploreIcon from 'assets/icons/explore_icon.svg';
import clientModalIcon from 'assets/icons/client_modal_icon.svg';
import descriptionModalIcon from 'assets/icons/discription_modal_icon.svg';
import problemModalIcon from 'assets/icons/problem_modal_icon.svg';
import solutionModalIcon from 'assets/icons/solution_modal_icon.svg';
import poModalIcon from 'assets/icons/po_modal_icon.svg';

import { useTranslation } from 'react-i18next';
interface modalDetailInnovationProp {
  isModalOpen: boolean;
  handleCancel: () => void;
  pdf_url: string;
  name: string;
  targetCustomer: string;
  descTargetCustomer: string;
  problemStatement: string;
  solution: string;
  ideaOwner: string;
  email: string;
}
const ModalDetailInnovation = ({
  isModalOpen,
  handleCancel,
  pdf_url,
  name,
  targetCustomer,
  descTargetCustomer,
  problemStatement,
  solution,
  ideaOwner,
  email,
}: modalDetailInnovationProp) => {
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
          <img src={PropensityIcon} alt="propensity-model-icon" width={'64px'} height={'64px'} />
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

          <span className="text-xl font-medium color-black my-auto line-clamp-2 w-[600px]">{name}</span>
        </div>
        <div className="leading-[24px]  py-5 pr-14 pl-5 h-[calc(100vh-300px)] overflow-y-auto">
          <div className="flex flex-row gap-4">
            <div className=" w-12 h-12 flex ">
              <img src={clientModalIcon} alt="icon-client" />
            </div>
            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('strategy_innovation.txt_customer')}</div>
              <pre className="font-normal  text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy] text-justify">
                {targetCustomer}
              </pre>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={descriptionModalIcon} alt="icon-client" />
            </div>
            <div className="flex flex-col ">
              <div className="font-medium text-xl text-[#32343A] ">{t('strategy_innovation.txt_description')}</div>
              <pre className="font-normal text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy] text-justify">
                {descTargetCustomer}
              </pre>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={problemModalIcon} alt="icon-client" />
            </div>
            <div className="flex flex-col ">
              <div className="font-medium text-xl text-[#32343A] ">{t('strategy_innovation.txt_problem')}</div>
              {/* <div className="font-normal text-[16px] text-[#71747B]">{des3}</div> */}
              <pre className="font-normal text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy] text-justify">
                {problemStatement}
              </pre>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={solutionModalIcon} alt="icon-client" />
            </div>

            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('strategy_innovation.txt_solution')}</div>
              <pre className="font-normal text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy]">{solution} </pre>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-5">
            <div className=" w-12 h-12 flex ">
              <img src={poModalIcon} alt="icon-client" />
            </div>

            <div className="flex flex-col">
              <div className="font-medium text-xl text-[#32343A] ">{t('strategy_innovation.txt_owner')}</div>
              <pre className="font-normal text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy]">{ideaOwner}</pre>
              <pre className="font-normal text-[16px] text-[#71747B] text-wrap my-0 font-[SVN-Gilroy]">{email}</pre>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalDetailInnovation;

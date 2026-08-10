import iconBookmark from 'assets/icons/icon_bookmark.svg';
import iconBookMarkSaved from 'assets/icons/icon_bookmark_saved.svg';
import exploreIcon from 'assets/icons/explore_icon.svg';
import exploreDisableIcon from 'assets/icons/explore_disable_icon.svg';
import iconSort from 'assets/icons/icon_sort.svg';
import iconSortSaved from 'assets/icons/icon_sort_saved.svg';
import iconFilter from 'assets/icons/icon_filter.svg';
import iconFilterSaved from 'assets/icons/icon_filter_saved.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';
import { Spin, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
interface TableListProps {
  handleOpenModal: (topic: any) => void;
  handelSort?: () => void;
  sort?: boolean;
  handelFilterTopic?: (value: string) => void;
  topicFilter?: string;
  handelFilterBU?: (value: string) => void;
  handleBookMark?: (document_id: string, is_save_bookmark: boolean) => void;
  buFilter?: string;
  showfilter: boolean;
  loadingidea?: boolean;
  listIdeas: Array<any>;
  listTopicSelect?: Array<any>;
  listBuSelect?: Array<any>;
  total?: number;
}
const TableListComponent = ({
  handleOpenModal,
  showfilter,
  handelSort,
  sort,
  handelFilterTopic,
  topicFilter,
  handelFilterBU,
  buFilter,
  listIdeas,
  listTopicSelect,
  handleBookMark,
  total,
  loadingidea,
}: TableListProps) => {
  const { t } = useTranslation();

  const listBU = [
    {
      value: '',
      label: 'All',
    },
    {
      value: '2',
      label: 'IDE',
    },
  ];

  return (
    <div className={twMerge('flex flex-col ', showfilter && 'overflow-y-auto h-[calc(100vh-300px)]')}>
      <div className="flex flex-row w-full bg-[#F1F4F9] h-12 px-5 items-center border border-solid border-[#DADADA] sticky top-0 z-10 py-4">
        <div className="text-sm font-bold text-[#202224] w-1/2 pr-4  flex flex-row justify-between">
          <span>
            {t('strategy_innovation.txt_idea_name')}
            {total && '  (' + total + ')'}
          </span>
          {showfilter && (
            <div
              onClick={() => {
                handelSort && handelSort();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handelSort && handelSort();
                }
              }}
            >
              <img src={sort ? iconSortSaved : iconSort} alt="icon-sort" className="cursor-pointer" />
            </div>
          )}
        </div>
        <div className="text-sm font-bold text-[#202224] w-3/12 px-4 flex flex-row justify-between">
          <span>{t('strategy_innovation.txt_topic')}</span>
          <Tooltip
            placement="bottomRight"
            title={
              <div className="flex flex-col py-2 ">
                {listTopicSelect?.map((item: any, index: number) => (
                  <div
                    className={twMerge(
                      'hover:bg-gray-200 rounded-sm px-2 cursor-pointer',
                      topicFilter === item.value && 'bg-gray-300',
                    )}
                    key={index}
                    onClick={() => {
                      handelFilterTopic && handelFilterTopic(item.value);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handelFilterTopic && handelFilterTopic(item.value);
                      }
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            }
            overlayInnerStyle={{ backgroundColor: '#fff', color: '#000', width: '250px' }}
            arrow={false}
          >
            {showfilter && (
              <img
                src={topicFilter ? iconFilterSaved : iconFilter}
                alt="icon-sort"
                height={'14px'}
                width={'auto'}
                className="my-auto cursor-pointer"
              />
            )}
          </Tooltip>
        </div>
        <div className="text-sm font-bold text-[#202224] w-1/6 px-4 flex flex-row justify-between">
          <span>{t('strategy_innovation.txt_bu')}</span>
          <Tooltip
            placement="bottomRight"
            title={
              <div className="flex flex-col py-2 ">
                {listBU?.map((item: any, index: number) => (
                  <div
                    className={twMerge(
                      'hover:bg-gray-300 rounded-sm px-2 cursor-pointer',
                      buFilter === item.value && 'bg-gray-200',
                    )}
                    key={index}
                    onClick={() => {
                      handelFilterBU && handelFilterBU(item.value);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handelFilterBU && handelFilterBU(item.value);
                      }
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            }
            overlayInnerStyle={{
              backgroundColor: '#fff',
              color: '#000',
              width: '200px',
            }}
            arrow={false}
          >
            {showfilter && (
              <img
                src={buFilter ? iconFilterSaved : iconFilter}
                alt="icon-sort"
                height={'14px'}
                width={'auto'}
                className="my-auto cursor-pointer"
              />
            )}
          </Tooltip>
        </div>
        <div className="text-sm font-bold text-[#202224] w-1/12 px-4">{t('strategy_innovation.txt_detail')}</div>
      </div>
      {loadingidea ? (
        <div className="">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <div className="bg-white  ">
          {listIdeas?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-row w-full px-5 items-center h-20"
              style={{
                borderBottom: '1px solid #D4D4D4',
              }}
            >
              <div className="text-sm font-normal text-[#25213B] w-1/2  flex flex-row gap-4 pr-4 ">
                <div
                  className="flex items-center cursor-pointer "
                  onClick={() => {
                    handleBookMark && handleBookMark(item.document_id, item.is_save_bookmark);
                  }}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleBookMark && handleBookMark(item.document_id, item.is_save_bookmark);
                    }
                  }}
                >
                  <img src={!item.is_save_bookmark ? iconBookmark : iconBookMarkSaved} alt="icon-bookmark" />
                </div>
                <div className="flex flex-col">
                  <div className="limit-lines-2 font-semibold">{item.name}</div>
                  <div className="text-[#6E6893] font-normal limit-lines-1 text-xs mt-1">{item.problem_statement}</div>
                </div>
                <div
                  className="flex items-end text-[#0052B4] underline text-xs font-normal cursor-pointer"
                  onClick={() => {
                    handleOpenModal(item);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenModal(item);
                    }
                  }}
                >
                  More
                </div>
              </div>
              <div className="text-sm font-normal text-[#000000] w-3/12 px-4 limit-lines-2">{item.topic}</div>
              <div className="text-sm font-normal text-[#000000] w-1/6 px-4">{item.bu}</div>
              <div className=" w-1/12 px-4">
                <img
                  src={item.pdf_url ? exploreIcon : exploreDisableIcon}
                  alt="explore-icon"
                  height={'27px'}
                  width={'auto'}
                  className={item.pdf_url ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={() => {
                    if (item.pdf_url) {
                      window.open(item.pdf_url, '_blank');
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TableListComponent;

import React, { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import groupAllIcon from '../../../../assets/icons/group_all_icon.svg';
import iconBookmark from '../../../../assets/icons/icon_bookmark.svg';
import iconBookMarkSaved from 'assets/icons/icon_bookmark_saved.svg';

import { twMerge } from 'tailwind-merge';
import TableListComponent from '../components/TableListComponent';
import ModalDetailInnovation from 'components/modalDetail/ModalDetailInnovation';
import { useTranslation } from 'react-i18next';
import PaginationComponent from 'components/pagination/PaginationComponent';
import { Button, Select } from 'antd';
import AwardItem from '../components/AwardItem';
import { bookMarkWinnovateIdeaById, getAllWinnovateGroup, getAllWinnovateIdeaAll, getAllWinnovateTopic } from '../api';
import { SortType } from '../../../../types/aiHub/index';
import { APP_CONFIG } from 'utils/env';
import { useSearchParams } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search')?.toString() || '';

  const [tabCurrent, setTabCurrent] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(100);
  const [pageSize, setPageSize] = useState(5);
  const [groupCurrent, setGroupCurrent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [saveList, setSaveList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingidea, setLoadingidea] = useState(false);
  const [listGroups, setListGroups] = useState<any>(null);
  const [listTopics, setListTopics] = useState<any>(null);
  const [listIdeas, setListIdeas] = useState<any>(null);
  const [datapopup, setDatapopup] = useState<any>(null);
  const [dataChart, setDataChart] = useState<any>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const chartRef = useRef(null);

  const [state, setState] = useState({
    sort: false,
    topicFilter: '',
    buFilter: '',
    listTopicSelect: [],
    listBuSelect: [],
    listGroupSelect: [],
  });
  const { sort, topicFilter, buFilter, listTopicSelect, listBuSelect, listGroupSelect } = state;

  useEffect(() => {
    setLoading(true);
    getAllWinnovateGroup()
      .then((res) => {
        setListGroups(res.data);
        const formatgroupSelect = res.data?.map((item: any) => ({
          value: item.document_id,
          label: item.name,
        }));
        setState((pre) => ({
          ...pre,
          listGroupSelect: formatgroupSelect,
        }));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    const params = {
      sortField: 'created_at',
      sortValue: SortType.ASC,
      groupDocumentId: tabCurrent === 0 ? groupCurrent : '',
    };
    getAllWinnovateTopic(params)
      .then((res) => {
        setListTopics(res.data);
        setDataChart({
          labels: res.data?.map((item: any) => item.name),
          datasets: [
            {
              label: ' Số lượng',
              data: res.data?.map((item: any) => item.total_idea),
              backgroundColor: res.data?.map((item: any) => item.color),
            },
          ],
        });
        const formatTopicSelect = res.data?.map((item: any) => ({
          value: item.document_id,
          label: item.name,
        }));
        formatTopicSelect.unshift({
          value: '',
          label: 'All',
        });

        setState((pre) => ({
          ...pre,
          listTopicSelect: formatTopicSelect,
        }));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupCurrent]);
  const FeatchGetAllIdea = () => {
    setLoadingidea(true);
    const params = {
      page: currentPage,
      limit: pageSize,
      sortField: tabCurrent === 0 ? 'priority' : 'name',
      sortValue: tabCurrent === 0 ? SortType.DESC : sort ? SortType.DESC : SortType.ASC,
      groupDocumentId: groupCurrent,
      topicDocumentId: tabCurrent === 0 ? '' : topicFilter,
      buDocumentId: '',
      // buDocumentId: tabCurrent === 0 ? '' : buFilter,
      isSaveBookmark: saveList ? 1 : 0,
      keyword: '',
    };
    getAllWinnovateIdeaAll(params)
      .then((res) => {
        setListIdeas(res?.data);
        setTotal(res?.meta.totalItem);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingidea(false);
      });
  };
  useEffect(() => {
    FeatchGetAllIdea();
  }, [sort, topicFilter, buFilter, saveList, currentPage, pageSize, groupCurrent]);

  const handleBookMark = async (document_id: string, is_save_bookmark: boolean | null) => {
    const ideas = listIdeas?.map((idea: any) => {
      if (idea.document_id === document_id) {
        return {
          ...idea,
          is_save_bookmark: is_save_bookmark ? false : true,
        };
      } else {
        return idea;
      }
    });
    setListIdeas(ideas);
    bookMarkWinnovateIdeaById(document_id, !is_save_bookmark ? true : false)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handelSort = () => {
    setState((pre) => ({ ...pre, sort: !sort }));
    setCurrentPage(1);
  };

  const handelFilterTopic = (value: string) => {
    setState((pre) => ({
      ...pre,
      topicFilter: value,
    }));
    setCurrentPage(1);
  };
  const handelFilterBU = (value: string) => {
    setState((pre) => ({
      ...pre,
      buFilter: value,
    }));
    setCurrentPage(1);
  };
  const handelFilterGroup = (value: string) => {
    setGroupCurrent(value);
    setCurrentPage(1);
  };

  const listTabs = ['Dashboard', 'Idea lists', 'Awards'];

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleOpenModal = (topic: any) => {
    setIsModalOpen(true);
    setDatapopup(topic);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dataAward = [
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
    {
      topic: 'chủ đề',
      name: 'Tính năng báo lỗi nhanh trên “SME” Connect',
      owner: 'Son Thai Le',
      bu: 'SME',
      url: '',
    },
  ];
  const options = {
    onClick: (_event: any, elements: any) => {
      if (elements.length > 0) {
        const chart: any = chartRef.current;
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const label = chart?.data?.labels[index];
        const value = chart?.data?.datasets[datasetIndex].data[index];
        console.log(`Label: ${label}, Value: ${value}`);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: false,
    maintainAspectRatio: false,
  };

  if (loading) return <div></div>;
  return (
    <div className="p-9 flex flex-col">
      <div className="flex flex-row w-full">
        <div className="w-1/3 text-[#1F2633] font-bold text-2xl ">{listTabs[tabCurrent]}</div>
        <div className="w-2/3 flex flex-row gap-6">
          {listTabs?.map((tab: string, index: number) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (index === 0) {
                  setPageSize(5);
                  setPageSize(5);
                } else {
                  if (index === 1) {
                    setPageSize(10);
                  }
                }
                setCurrentPage(1);
                setTabCurrent(index);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (index === 0) {
                    setPageSize(5);
                    setPageSize(5);
                  } else {
                    if (index === 1) {
                      setPageSize(10);
                    }
                  }
                  setCurrentPage(1);
                  setTabCurrent(index);
                }
              }}
              className={'text-xl font-bold cursor-pointer pb-1'}
              style={
                index === tabCurrent ? { borderBottom: '1px solid #3B82F6', color: '#3B82F6' } : { color: '#98A2B2' }
              }
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      {tabCurrent === 0 ? (
        <div>
          <div className="my-5">
            <Swiper
              rewind={true}
              breakpoints={{
                320: {
                  spaceBetween: 32,
                },
              }}
              slidesPerView="auto"
              className="mySwiper product-images-slider"
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation]}
            >
              {listGroups?.map((item: any, index: number) => (
                <SwiperSlide
                  key={index}
                  className=" cursor-pointer"
                  style={{ width: '292px', height: '161px' }}
                  onClick={() => {
                    handelFilterGroup(item.document_id);
                  }}
                >
                  <div
                    className={twMerge(
                      'p-5 flex flex-col  rounded-[14px] h-full',
                      groupCurrent === item.document_id ? 'bg-[#C7DCF2]' : 'bg-white',
                    )}
                  >
                    <div className="flex flex-row">
                      <div className="flex flex-col w-2/3">
                        <div className="text-[#202224] text-[16px] font-semibold mb-4">Số lượng</div>
                        <div className="text-[#202224] text-[28px] font-bold">{item.total_idea}</div>
                      </div>
                      <div className="w-1/3 text-right">
                        <img
                          src={item.url ? APP_CONFIG.imageMediaUrl + item.url : groupAllIcon}
                          alt="icon-group"
                          width={'63px'}
                          height={'63px'}
                        />
                      </div>
                    </div>
                    <div
                      className="text-[18px] font-semibold mt-auto"
                      style={{
                        color: item.color,
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="w-full  bg-white flex flex-col rounded-xl mb-5">
            <div className="text-[#1F1F25] text-[16px] font-bold h-11 flex items-center ml-6">
              {t('strategy_innovation.txt_ranking')}
            </div>
            <div className="flex w-full flex-row h-[291px]">
              <div className="flex justify-center items-center w-1/4">
                <Doughnut data={dataChart} options={options} ref={chartRef} width={'212px'} height={'212px'} />
              </div>
              <div className="w-3/4 flex flex-col mx-6 ">
                <div
                  className="flex flex-row w-full p-2"
                  style={{
                    borderBottom: '1px solid #D4D4D4',
                  }}
                >
                  <div className="text-sm font-medium text-[#737373] w-1/2 text-left">
                    {t('strategy_innovation.txt_topic')}
                  </div>
                  <div className="text-sm font-medium text-[#737373] w-1/4 text-right">
                    {t('strategy_innovation.txt_quantity')}
                  </div>
                  <div className="text-sm font-medium text-[#737373] w-1/4 text-right">
                    {t('strategy_innovation.txt_percent')}
                  </div>
                </div>
                {listTopics?.map((topic: any, index: number) => (
                  <div key={index} className="flex flex-row w-full p-2">
                    <div className="w-1/2 text-left flex flex-row ">
                      <div
                        className="h-3 w-3 rounded-full my-auto mx-1"
                        style={{
                          background: topic.color,
                        }}
                      ></div>
                      <div className="text-sm font-medium text-[#404040]  ">{topic.name}</div>
                    </div>
                    <div className="text-sm font-medium text-[#0A0A0A] w-1/4 text-right">{topic.total_idea}</div>
                    <div className="text-sm font-medium text-[#0A0A0A] w-1/4 text-right">
                      {Number(topic.idea_pct).toFixed(0) + '%'}{' '}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-9 py-10 w-full  bg-white flex flex-col rounded-xl mb-5">
            <div className="flex flex-row justify-between mb-6">
              <div className="text-[24px] text-[#202224] font-bold ">{t('strategy_innovation.txt_top5')}</div>
              <div
                className="text-[#0052B4] underline text-xs font-normal cursor-pointer "
                onClick={() => {
                  setPageSize(10);
                  setCurrentPage(1);
                  setTabCurrent(1);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPageSize(10);
                    setCurrentPage(1);
                    setTabCurrent(1);
                  }
                }}
              >
                {t('strategy_innovation.txt_view_all')}
              </div>
            </div>
            <TableListComponent
              handleBookMark={handleBookMark}
              listIdeas={listIdeas}
              handleOpenModal={handleOpenModal}
              showfilter={false}
            />
          </div>
        </div>
      ) : tabCurrent === 1 ? (
        <div className="pb-10">
          <div className="flex flex-row justify-end gap-6 mb-5">
            <div>
              <span className="text-black text-sm">Group:</span>
              <Select
                className="w-[120px] h-[30px] ml-2"
                options={listGroupSelect}
                value={groupCurrent}
                onChange={(e) => {
                  handelFilterGroup(e);
                }}
                popupMatchSelectWidth={200}
              ></Select>
            </div>
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
          </div>

          <div>
            <TableListComponent
              handleOpenModal={handleOpenModal}
              listIdeas={listIdeas}
              showfilter={true}
              handelSort={handelSort}
              sort={sort}
              handelFilterTopic={handelFilterTopic}
              handelFilterBU={handelFilterBU}
              topicFilter={topicFilter}
              buFilter={buFilter}
              listTopicSelect={listTopicSelect}
              listBuSelect={listBuSelect}
              handleBookMark={handleBookMark}
              total={total}
              loadingidea={loadingidea}
            />
            <div className="flex flex-row mx-auto left-[40%] absolute bottom-6 ">
              <PaginationComponent
                total={total}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className=" text-xl font-medium text-black mt-10 pb-6"
            style={{
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            Top 6
          </div>
          {dataAward?.map((item: any, index: number) => (
            <AwardItem key={index} topic={item.topic} name={item.name} owner={item.owner} bu={item.bu} url={item.url} />
          ))}
        </div>
      )}
      <ModalDetailInnovation
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
        pdf_url={datapopup?.pdf_url}
        name={datapopup?.name}
        targetCustomer={datapopup?.target_customer}
        descTargetCustomer={datapopup?.desc_target_customer}
        problemStatement={datapopup?.problem_statement}
        solution={datapopup?.solution}
        ideaOwner={'Khối: ' + datapopup?.idea_owner}
        email={'Liên hệ: ' + datapopup?.email}
      />
    </div>
  );
};
export default Dashboard;

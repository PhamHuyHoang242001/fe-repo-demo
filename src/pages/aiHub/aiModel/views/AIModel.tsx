import React, { useEffect, useState } from 'react';
import AIModelItem from '../components/AIModelItem';
import { getAllAIModel } from '../api';
import { AIModelReq, AIModelType, SortType } from '../../../../types/aiHub/index';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from 'utils/env';
interface AIModelResponse {
  id: string;
  name: string;
  image?: string;
  logo?: string;
  url?: string;
  purpose: string;
  impact: string;
  document_id: string;
}

const AIModel: React.FC = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValue = searchParams.get('search')?.toString() || '';
  const [aiModels, setAIModels] = useState<AIModelResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchAIModels = (page: number) => {
    setLoading(true);
    const params: AIModelReq = {
      sortField: 'created_at',
      sortValue: SortType.ASC,
      type: AIModelType.AI_HUB,
      limit: 6,
      page,
      keyword: searchValue || '',
    };

    getAllAIModel(params)
      .then((res: any) => {
        if (res?.meta?.hasNextPage === false) {
          setHasMore(false);
        }
        if (page > 1) {
          setAIModels((prevAIModels) => [...prevAIModels, ...res?.data]);
        } else {
          setAIModels(res?.data);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setHasMore(true);
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    fetchAIModels(page);
  }, [page, searchValue]);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <div className="flex justify-items-center py-6 ">
      <div className="flex flex-wrap w-[1200px] gap-16 mx-auto ">
        {aiModels?.map((data: AIModelResponse) => (
          <AIModelItem
            key={data.id}
            id={data.id}
            image={APP_CONFIG.imageMediaUrl + data?.url || ''}
            name={data.name}
            purpose={data.purpose}
            impact={data.impact}
            document_id={data.document_id}
          />
        ))}
      </div>
    </div>
  );
};

export default AIModel;

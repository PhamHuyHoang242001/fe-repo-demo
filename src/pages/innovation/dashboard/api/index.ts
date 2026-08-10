import { winnovateIdeaReq, winnovateTopicReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllWinnovateIdeaAll = (params: winnovateIdeaReq): Promise<any> => {
  const newParam =
    params &&
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== 0 && value !== null));
  return HttpService.get(`/winnovate-idea/all`, { ...newParam });
};

export const getAllWinnovateGroup = (): Promise<any> => {
  return HttpService.get(`/winnovate-group/all`);
};

export const getAllWinnovateTopic = (params: winnovateTopicReq): Promise<any> => {
  const newParam =
    params &&
    Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== 0 && value !== null));
  return HttpService.get(`/winnovate-topic/all`, { ...newParam });
};

export const bookMarkWinnovateIdeaById = (document_id: string, is_save_bookmark: boolean | null): Promise<any> => {
  return HttpService.post(
    `/winnovate-idea/${document_id}/bookmark`,
    is_save_bookmark !== null ? { is_save_bookmark: is_save_bookmark } : {},
  );
};

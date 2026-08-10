import { AIAppReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllAIApp = (params: AIAppReq): Promise<any> => {
  const newParam =
    params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== 0));
  return HttpService.get(`/ai-app/all`, { ...newParam });
};

export const getAllCategoryAIApp = (): Promise<any> => {
  return HttpService.get(`/ai-app-category/all`);
};

export const likeAIAppById = (aiAppId: string, is_like: boolean | null): Promise<any> => {
  return HttpService.post(`/ai-app/${aiAppId}/like`, is_like ? { quantity: -1 } : { quantity: 1 });
};

export const bookMarkAIAppById = (aiAppId: string, is_save_bookmark: boolean | null): Promise<any> => {
  return HttpService.post(
    `/ai-app/${aiAppId}/bookmark`,
    is_save_bookmark !== null ? { is_save_bookmark: is_save_bookmark } : {},
  );
};

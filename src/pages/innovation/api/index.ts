import { winnovateCategoryReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllWinnovateCategory = (params: winnovateCategoryReq): Promise<any> => {
  const newParam =
    params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== 0));
  return HttpService.get(`/winnovate-category/all`, { ...newParam });
};

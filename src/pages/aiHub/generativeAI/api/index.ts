import { GenerativeModelReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllGeneratives = (params: GenerativeModelReq): Promise<any> => {
  const newParam = params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''));
  return HttpService.get('/ai-generative/all', { ...newParam });
};

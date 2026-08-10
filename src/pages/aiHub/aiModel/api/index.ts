import { AIModelReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllAIModel = (params: AIModelReq): Promise<any> => {
  const newParam = params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''));
  return HttpService.get('/ai-model/all', { ...newParam });
};

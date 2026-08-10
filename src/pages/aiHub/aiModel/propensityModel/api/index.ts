import { PropensityModelReq } from 'types/aiHub';
import HttpService from 'utils/http';

export const getAllPropensityModelByAIModel = (
  aiModelId: string | undefined,
  params: PropensityModelReq,
): Promise<any> => {
  const newParam = params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''));
  return HttpService.get(`/ai-propensity-model/${aiModelId}/all`, { ...newParam });
};

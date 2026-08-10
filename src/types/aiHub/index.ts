export enum AIModelType {
  AI_HUB = 'ai-hub',
  BI_HUB = 'bi-hub',
  ECOSYSTEM = 'ecosystem',
  DATA_HUB = 'data-hub',
  GOVERNANCE = 'governance',
  STRATEGY_INNOVATION = 'strategy-innovation',
}

export enum SortType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface AIModelReq {
  sortField: string;
  sortValue: SortType;
  limit: number;
  page: number;
  type: AIModelType;
  keyword?: string;
}
export interface PropensityModelReq {
  sortField: string;
  sortValue: SortType;
  limit: number;
  page: number;
  keyword?: string;
}
export interface AIAppReq {
  sortField: string;
  categoryDocumentId?: string;
  sortValue: SortType | string;
  limit: number;
  page: number;
  keyword?: string;
  isSaveBookmark?: number;
}

export interface GenerativeModelReq {
  sortField: string;
  sortValue: SortType;
  limit: number;
  page: number;
  keyword?: string;
}

export interface winnovateCategoryReq {
  sortField: string;
  sortValue: SortType;
  limit: number;
  page: number;
  keyword?: string;
}
export interface winnovateIdeaReq {
  sortField: string;
  sortValue: SortType;
  limit: number;
  page: number;
  keyword?: string;
  groupDocumentId?: string;
  topicDocumentId?: string;
  buDocumentId?: string;
  isSaveBookmark?: number;
}

export interface winnovateTopicReq {
  sortField: string;
  sortValue: SortType;
  groupDocumentId?: string;
}

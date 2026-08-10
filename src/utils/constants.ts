import { APP_CONFIG } from './env';

export const listStatus = new Map([
  [
    'development',
    {
      color: '#1019FF80',
      name: 'Development',
    },
  ],
  [
    'pilot',
    {
      color: '#FFBC10',
      name: 'Pilot',
    },
  ],
  [
    'production',
    {
      color: '#FFBC10',
      name: 'Production',
    },
  ],
  [
    'go-live',
    {
      color: '#3CB632',
      name: 'Go-live',
    },
  ],
]);
export const ListSortBy = new Map([
  [
    '1',
    {
      sortField: 'name',
      sortValue: 'ASC',
    },
  ],
  [
    '2',
    {
      sortField: 'name',
      sortValue: 'DESC',
    },
  ],
  [
    '3',
    {
      sortField: 'created_at',
      sortValue: 'DESC',
    },
  ],
  [
    '4',
    {
      sortField: 'created_at',
      sortValue: 'ASC',
    },
  ],
  [
    '5',
    {
      sortField: 'total_like',
      sortValue: 'DESC',
    },
  ],
  [
    '6',
    {
      sortField: 'total_like',
      sortValue: 'ASC',
    },
  ],
]);

export const URL_EXAMPLE_IDE_FILE = APP_CONFIG.imageMediaUrl + '/uploads/sample_41b9be5a0f.pdf';

//header
// list page not show search
export const listPageDisableSearch = ['app'];
// detail page not show search
export const listPageDetailDisableSearch = ['all-app'];

//get name url
export const listUrlName = [
  { home: 'Home' },
  { 'ai-hub': 'AI Hub' },
  { model: 'AI/ML Models' },
  { 'propensity-model': 'Propensity Models' },
  { app: 'AI Apps' },
  { 'all-app': 'All Apps' },
  { 'generative-ai': 'Generative AI' },
  { 'bi-hub': 'BI Hub' },
  { ecosystem: 'Ecosystem' },
  { 'strategy-innovation': 'Strategy & Innovation' },
  { innovation: 'Innovation' },
];
// get api get name
export const listApiGetNameById = [
  { model: '/ai-model/' },
  { 'all-app': '/ai-app/' },
  { innovation: '/winnovate-category/' },
];

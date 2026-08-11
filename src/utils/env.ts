export const APP_CONFIG = {
  debug: true,
  apiUrl: process.env.BASE_URL + '/api/v1' || '',
  assistantBotUrl: process.env.ASSISTANT_BOT_URL || '',
  imageMediaUrl: process.env.BASE_URL || '',
  tokenKey: process.env.TOKEN_KEY || '',
  refreshToken: process.env.REFRESH_TOKEN || '',
  appApiKey: process.env.APP_API_KEY || '',
  // Strapi upload target for the pull-based skill upload flow: the browser uploads
  // the zip/avatar to Strapi, then sends the resulting URL to the NestJS backend.
  strapiUploadUrl: process.env.STRAPI_UPLOAD_URL || 'http://localhost:1337',
  strapiUploadToken: process.env.STRAPI_UPLOAD_TOKEN || '',
  user: 'user',
};

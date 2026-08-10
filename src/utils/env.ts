export const APP_CONFIG = {
  debug: true,
  apiUrl: process.env.BASE_URL + '/api' || '',
  assistantBotUrl: process.env.ASSISTANT_BOT_URL || '',
  imageMediaUrl: process.env.BASE_URL || '',
  tokenKey: process.env.TOKEN_KEY || '',
  refreshToken: process.env.REFRESH_TOKEN || '',
  appApiKey: process.env.APP_API_KEY || '',
  user: 'user',
};

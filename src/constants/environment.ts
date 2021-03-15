export const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000;
export const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || '';
export const SUPER_ADMIN = process.env.SUPER_ADMIN;

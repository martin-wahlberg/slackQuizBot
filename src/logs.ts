import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';

export const initLogger = () => {
  winston.add(
    new Loggly({
      token: '9c5f5918-6055-4f4f-b090-34a35af3aea0',
      subdomain: 'martinwahlberg',
      tags: ['QuizBot', process.env.ENVIRONMENT || 'DEV'],
      json: true
    })
  );

  winston.log('info', 'App restarted');
};

export const remoteLogError = (type: string, error: any) => {
  winston.log('error', type, error);
};

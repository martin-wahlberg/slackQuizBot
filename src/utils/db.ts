import { databaseRef } from '../firebase';
import { remoteLogError } from '../logs';

export const getFromDb = <T>(keyPath: string) => {
  return new Promise<T | undefined>((resolve, reject) =>
    databaseRef
      .child(keyPath)
      .once('value')
      .then(snapshot => {
        resolve(snapshot.val());
      })
      .catch(err => {
        remoteLogError('getFromDb', err);
        reject(err);
      })
  );
};

export const writeToDb = (keyPath: string, data: Object) =>
  databaseRef
    .child(keyPath)
    .set(data)
    .catch(err => {
      remoteLogError('writeToDb', err);
    });

export const pushToDb = (keyPath: string, data: any) =>
  databaseRef
    .child(keyPath)
    .push(data)
    .catch(err => {
      remoteLogError('writeToDb', err);
    });

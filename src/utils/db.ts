import { databaseRef } from '../firebase';

export const getFromDb = <T>(keyPath: string) => {
  return new Promise<T | undefined>((resolve, reject) =>
    databaseRef
      .child(keyPath)
      .once('value')
      .then(snapshot => {
        resolve(snapshot.val());
      })
      .catch(err => {
        console.log('getFromDb', err);
        reject(err);
      })
  );
};

export const writeToDb = (keyPath: string, data: Object) =>
  databaseRef
    .child(keyPath)
    .set(data)
    .catch(err => {
      console.log('writeToDb', err);
    });

export const pushToDb = (keyPath: string, data: any) =>
  databaseRef
    .child(keyPath)
    .push(data)
    .catch(err => {
      console.log('pushToDb', err);
    });

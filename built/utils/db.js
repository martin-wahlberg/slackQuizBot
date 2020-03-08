"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
const logs_1 = require("../logs");
exports.getFromDb = (keyPath) => {
    return new Promise((resolve, reject) => firebase_1.databaseRef
        .child(keyPath)
        .once('value')
        .then(snapshot => {
        resolve(snapshot.val());
    })
        .catch(err => {
        logs_1.remoteLogError('getFromDb', err);
        reject(err);
    }));
};
exports.writeToDb = (keyPath, data) => firebase_1.databaseRef
    .child(keyPath)
    .set(data)
    .catch(err => {
    logs_1.remoteLogError('writeToDb', err);
});
exports.pushToDb = (keyPath, data) => firebase_1.databaseRef
    .child(keyPath)
    .push(data)
    .catch(err => {
    logs_1.remoteLogError('writeToDb', err);
});
//# sourceMappingURL=db.js.map
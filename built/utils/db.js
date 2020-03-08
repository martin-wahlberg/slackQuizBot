"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
exports.getFromDb = (keyPath) => {
    return new Promise((resolve, reject) => firebase_1.databaseRef
        .child(keyPath)
        .once('value')
        .then(snapshot => {
        resolve(snapshot.val());
    })
        .catch(err => {
        console.log('getFromDb', err);
        reject(err);
    }));
};
exports.writeToDb = (keyPath, data) => firebase_1.databaseRef
    .child(keyPath)
    .set(data)
    .catch(err => {
    console.log('writeToDb', err);
});
exports.pushToDb = (keyPath, data) => firebase_1.databaseRef
    .child(keyPath)
    .push(data)
    .catch(err => {
    console.log('writeToDb', err);
});
//# sourceMappingURL=db.js.map
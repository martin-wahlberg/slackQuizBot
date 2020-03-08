"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
admin.initializeApp({
    credential: admin.credential.cert({
        //@ts-ignore
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        projectId: 'slackbots-84cf4',
        clientEmail: 'firebase-adminsdk-6388z@slackbots-84cf4.iam.gserviceaccount.com'
    }),
    databaseURL: 'https://slackbots-84cf4.firebaseio.com'
});
exports.databaseRef = admin
    .database()
    .ref()
    .child(`quizbot/${process.env.ENVIRONMENT || 'dev'}`);
//# sourceMappingURL=firebase.js.map
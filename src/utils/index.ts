import { writeToDb, getFromDb, pushToDb } from './db';
import boltApp from '../bolt';
import { View } from '@slack/web-api';
import moment = require('moment');

export const addUser = async (addedBy: string, userName: string) => {
  const users = await getFromDb<User[]>('users');
  writeToDb('users', [
    ...(users || []),
    { userName: userName.replace(/addUser/gi, '').trim(), addedBy }
  ]);
};

export const checkIfUserExists = async (userName: string) => {
  const users = await getFromDb<User[]>('users');
  return (
    ((!!users?.length || process.env.SUPER_ADMIN) &&
      !!userName.includes(process.env.SUPER_ADMIN || '')) ||
    !!users?.find(cur => cur.userName.includes(userName))
  );
};

let logging = false;
export const log = async (key: string) => {
  if (logging) {
    setTimeout(() => {
      log(key);
    }, 100);
  } else {
    logging = true;
    const analytics = await getFromDb<{ [k: string]: number }>('log');
    const keyCount = analytics && analytics[key] ? analytics[key] + 1 : 1;
    writeToDb('log', { ...analytics, [key]: keyCount }).finally(() => {
      logging = false;
    });
  }
};

export const openModal = (trigger_id: string, view: View) => {
  boltApp.client.views
    .open({
      token: process.env.SLACK_BOT_TOKEN,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: trigger_id,
      // View payload
      view
    })
    .catch(err => {
      console.log('Open modal error', err);
    });
};

const getDay = (dayNumber: number) => {
  switch (dayNumber) {
    case 0:
      return 'søndag';
    case 1:
      return 'mandag';
    case 2:
      return 'tirsdag';
    case 3:
      return 'onsdag';
    case 4:
      return 'torsdag';
    case 5:
      return 'fredag';
    case 6:
      return 'lørdag';
    case 7:
      return 'søndag';
    default:
      return 'never';
  }
};

const makeWeekDayObject = (points: number, bonus: number, day?: string) => ({
  [day ? day : getDay(moment().day())]: { points, bonus }
});

const updateWeek = (newDay: { [day: string]: Day }, week?: Week): Week => {
  const weekNumber = moment().week();
  const isCurrentWeek = week?.weekNumber !== weekNumber;

  const thisWeek = {
    ...(isCurrentWeek && week),
    days: { ...week?.days, ...newDay },
    weekNumber:
      (weekNumber === week?.weekNumber && week.weekNumber) || weekNumber,
    weekLastUpdated: moment().valueOf()
  };

  if (!isCurrentWeek) {
    pushToDb('pastWeeks', week);
  }

  writeToDb('currentWeek', thisWeek);

  return thisWeek;
};

const updateStreak = (todaysPoints: number, streak?: Streak): Streak => {
  const onStreak = streak?.points === todaysPoints;
  const currentNumberOfDays = streak?.numberOfDays || 0;
  const thisStreak = {
    points: todaysPoints,
    numberOfDays: onStreak ? currentNumberOfDays + 1 : 1
  };

  writeToDb('streak', thisStreak);

  return thisStreak;
};

export const updateScores = async (points: number, bonus: number) => {
  const [currentWeek, currentStreak] = await Promise.all([
    getFromDb<Week>('currentWeek'),
    getFromDb<Streak>('streak')
  ]);
  const week = updateWeek(makeWeekDayObject(points, bonus), currentWeek);
  const streak = updateStreak(points, currentStreak);
  const today = { points, bonus };
  return { week, streak, today };
};

export const getPointEmoji = (points: number) => {
  switch (points) {
    case 1:
      return ':shit:';
    case 2:
      return ':face_palm:';
    case 3:
      return ':shrug:';
    case 4:
      return ':partly_sunny_rain:';
    case 5:
      return ':woman-tipping-hand:';
    case 6:
      return ':muscle:';
    case 7:
      return ':star:';
    case 8:
      return ':star-struck:';
    case 9:
      return ':tada:';
    case 10:
      return ':fire:';
    default:
      return ':shrug:';
      break;
  }
};

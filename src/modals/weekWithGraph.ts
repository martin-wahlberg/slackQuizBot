import { View } from '@slack/web-api';
import { databaseRef } from '../firebase';
import { getChartImageUrl, getWeekDayNumber } from '../utils';

export enum WeekTypes {
  BEST_WEEK = 'bestWeek',
  LAST_WEEK = 'lastWeek',
  WORST_WEEK = 'worstWeek'
}

const getWeek = (weekType: WeekTypes) => {
  const pastWeeks = databaseRef.child('pastWeeks');

  switch (true) {
    case weekType == WeekTypes.BEST_WEEK:
      return pastWeeks
        .orderByChild('totalPoints')
        .limitToLast(1)
        .once('value')
        .then(snapshot => snapshot.val());

    case weekType == WeekTypes.LAST_WEEK:
      return pastWeeks
        .orderByChild('weekNumber')
        .limitToLast(1)
        .once('value')
        .then(snapshot => snapshot.val());

    case weekType == WeekTypes.WORST_WEEK:
      return pastWeeks
        .orderByChild('totalPoints')
        .limitToFirst(1)
        .once('value')
        .then(snapshot => snapshot.val());

    default:
      return pastWeeks
        .orderByChild('weekNumber')
        .once('value')
        .then(snapshot => snapshot.val());
  }
};

const getWeekText = (weekType: WeekTypes, weekContent: Week) => {
  switch (true) {
    case weekType === WeekTypes.BEST_WEEK:
      return `Uke ${weekContent.weekNumber} er den beste uken noen gang. Den uken fikk vi totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;
    case weekType === WeekTypes.WORST_WEEK:
      return `Uke ${weekContent.weekNumber} er den værste uken noen gang. Den uken fikk vi totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :shit:`;
    case weekType === WeekTypes.LAST_WEEK:
      return `Forrige uke ble det totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;

    default:
      return 'Nå skjedde det no feil her...';
  }
};

const getWeekTitle = (weekType: WeekTypes) => {
  switch (true) {
    case weekType === WeekTypes.BEST_WEEK:
      return 'Beste uke';
    case weekType === WeekTypes.WORST_WEEK:
      return 'Verste uke';
    case weekType === WeekTypes.LAST_WEEK:
      return 'Forrige uke';

    default:
      return ':thinking_face:';
  }
};

const getWeekWithGraphModal = async (weekType: WeekTypes) => {
  const week = getWeek(weekType);
  const weekData: { [key: string]: Week } | undefined = await week;
  const weekContent = weekData && Object.values(weekData)[0];

  const weekDays: DayPointsObject[] | undefined =
    weekContent &&
    Object.entries(weekContent.days)
      .map(cur => ({
        day: cur[0],
        points: cur[1].points,
        bonus: cur[1].bonus
      }))
      .sort((a, b) => getWeekDayNumber(a.day) - getWeekDayNumber(b.day));

  const chartImageUrl =
    weekDays &&
    getChartImageUrl({
      type: 'bar',
      data: {
        labels: weekDays.map(cur => cur.day),
        datasets: [
          {
            label: 'Legitime poeng',
            data: weekDays.map(cur => cur.points)
          },
          {
            label: 'Bonuspoeng',
            data: weekDays.map(cur => cur.bonus)
          }
        ]
      }
    });

  const blocks = weekContent
    ? [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: getWeekText(weekType, weekContent)
          }
        },
        {
          type: 'image',
          image_url:
            (chartImageUrl && encodeURI(chartImageUrl)) ||
            'https://source.unsplash.com/1600x900/?kitten',
          alt_text: 'chart'
        }
      ]
    : [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Fikk ikke hentet uke :slightly_frowning_face:`
          }
        }
      ];

  const modal: View = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: getWeekTitle(weekType),
      emoji: true
    },
    close: {
      type: 'plain_text',
      text: 'Lukk',
      emoji: true
    },
    blocks
  };
  return modal;
};

export default getWeekWithGraphModal;

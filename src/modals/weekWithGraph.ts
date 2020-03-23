import { View } from '@slack/web-api';
import { databaseRef } from '../firebase';
import { getChartImageUrl } from '../utils';

export enum WeekTypes {
  BEST_WEEK = 'bestWeek',
  LAST_WEEK = 'lastWeek'
}

const getWeek = (weekType: WeekTypes) => {
  const pastWeeks = databaseRef.child('pastWeeks');

  switch (true) {
    case weekType == WeekTypes.BEST_WEEK:
      return pastWeeks
        .orderByChild('weekLastUpdated')
        .limitToLast(1)
        .once('value')
        .then(snapshot => snapshot.val());

    case weekType == WeekTypes.LAST_WEEK:
      return pastWeeks
        .orderByChild('weekNumber')
        .limitToLast(1)
        .once('value')
        .then(snapshot => snapshot.val());

    default:
      return pastWeeks
        .orderByChild('weekNumber')
        .limitToFirst(1)
        .once('value')
        .then(snapshot => snapshot.val());
  }
};

const getWeekText = (weekType: WeekTypes, weekContent: Week) => {
  switch (true) {
    case weekType === WeekTypes.BEST_WEEK:
      return `Uke ${weekContent.weekNumber} er beste uken noen gang. Den uken fikk vi totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;
    case weekType === WeekTypes.LAST_WEEK:
      return `Forrige uke ble det totalt ${weekContent.totalCombined} poeng hvorav ${weekContent.totalPoints} var legitime poeng og ${weekContent.totalBonus} var bonuspoeng :clap:`;

    default:
      return 'Nå skjedde det no feil her...';
  }
};

const getWeekWithGraphModal = async (weekType: WeekTypes) => {
  const week = getWeek(weekType);
  const weekData: { [key: string]: Week } | undefined = await week;
  const weekContent = weekData && Object.values(weekData)[0];

  const weekDays = weekContent && Object.entries(weekContent.days);

  const chartImageUrl =
    weekDays &&
    getChartImageUrl({
      type: 'bar',
      data: {
        labels: weekDays.map(cur => cur[0]),
        datasets: [
          {
            label: 'Legitime poeng',
            data: weekDays.map(cur => cur[1].points)
          },
          {
            label: 'Bonuspoeng',
            data: weekDays.map(cur => cur[1].bonus)
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

  console.log(chartImageUrl);

  const modal: View = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Beste uke',
      emoji: true
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true
    },
    blocks
  };
  return modal;
};

export default getWeekWithGraphModal;

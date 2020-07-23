import boltApp from '../bolt';
import { updateScores, getPointEmoji } from '../utils';

export const quizMessage = (time?: string) => {
  const text = time
    ? `Det er straks tid for quiz! :medal:\nQuizen starter ${time}\n<!channel>`
    : `Nå er det tid for quiz! :medal:\n<!channel>`;

  return {
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.QUIZ_CHANNEL_ID || '',
    text,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Registrer resultat',
            emoji: true
          },
          action_id: 'register_score'
        }
      }
    ]
  };
};

export const updateMessageWithStats = async (input: Object, ts: string) => {
  const formState = input as ScoreFormInput;
  let legitimatePoints = parseInt(formState.legitimate.legitimate.value);
  let bonusPoints = parseFloat(formState.bonus.bonus.value) || 0;

  legitimatePoints = legitimatePoints > 10 ? 10 : legitimatePoints;

  bonusPoints =
    legitimatePoints + bonusPoints > 10 ? 10 - legitimatePoints : bonusPoints;

  const updatedScores = await updateScores(legitimatePoints, bonusPoints);
  const [
    todayPoints,
    todayBonus,
    todayCombined,
    streak,
    weekPoints,
    weekBonus,
    days,
    weekBestDay
  ] = [
    updatedScores.today.points,
    updatedScores.today.bonus,
    updatedScores.today.points + updatedScores.today.bonus,
    updatedScores.streak.numberOfDays > 2 && updatedScores.streak,
    Object.values(updatedScores.week.days).reduce(
      (acc, cur) => acc + cur.points,
      0
    ),
    Object.values(updatedScores.week.days).reduce(
      (acc, cur) => acc + cur.bonus,
      0
    ),
    Object.keys(updatedScores.week.days).length,
    (() => {
      const [day, dayData] = Object.entries(updatedScores.week.days).reduce(
        (acc, cur) => {
          const [, accData] = acc;
          const [, curData] = cur;

          return curData.points + curData.bonus > accData.points + accData.bonus
            ? cur
            : acc;
        }
      );
      return `Ukens beste dag er ${day} med ${dayData.points} poeng ${
        dayData.bonus ? `og ${dayData.bonus} bonuspoeng` : ''
      } :clap:`;
    })()
  ];

  const streakText =
    streak &&
    `!\nDette er dag ${streak.numberOfDays} med ${
      streak.points
    } poeng på rad ${(() => {
      let string = '';
      for (let i = 0; i < streak.numberOfDays; i++) {
        string = string + getPointEmoji(streak.points);
      }
      return string;
    })()}`;

  const text = `I dag ble det totalt ${todayCombined} poeng${
    streak ? streakText : getPointEmoji(todayPoints)
  }`;

  const blocks: any[] = [
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `${todayPoints} poeng og ${todayBonus} bonuspoeng`
        }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'plain_text',
        text,
        emoji: true
      },
      accessory: {
        type: 'overflow',
        action_id: 'quiz_stats',
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'Se forrige uke :pager:',
              emoji: true
            },
            value: 'lastWeek'
          },
          {
            text: {
              type: 'plain_text',
              text: 'Se beste uke :fire:',
              emoji: true
            },
            value: 'bestWeek'
          },
          {
            text: {
              type: 'plain_text',
              text: 'Se verste uke :shit:',
              emoji: true
            },
            value: 'worstWeek'
          }
        ]
      }
    }
  ];

  if (days > 1) {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        emoji: true,
        text:
          weekBestDay +
          `\nTotalt denne uken er det ${weekPoints} poeng og ${weekBonus} bonuspoeng med en gjennomittscore på ${Number(
            (weekBonus + weekPoints) / days
          ).toFixed(1)} poeng per quiz! :bow:`
      }
    });
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `(${weekPoints}+${weekBonus})/${days}`
        }
      ]
    });
  }

  boltApp.client.chat.update({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.QUIZ_CHANNEL_ID || '',
    ts,
    text,
    blocks
  });
};

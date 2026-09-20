import { titleCase } from "@/lib/format";
import {
  formatTrainDelayMessage,
  getTrainDelayMinutes,
} from "@/lib/live-status-helpers";
import type { FaqItem } from "@/lib/train-schedule-faq";
import type { TrainLiveStatusResponse } from "@/lib/types/live-status";
import type { TrainListItem } from "@/lib/types/train-list";

export const LIVE_TRAIN_STATUS_INDEX_FAQ: FaqItem[] = [
  {
    question: "How do I check live train status?",
    answer:
      "Enter a train number or name on this page and tap Track Live. You'll see the train's current station, delay in minutes, and station-by-station progress for Indian Railways.",
  },
  {
    question: "What does live train running status show?",
    answer:
      "Live status shows where the train is right now, how late or early it is, the next station, and actual vs scheduled arrival and departure times at each halt.",
  },
  {
    question: "Do I need a PNR number to track a train?",
    answer:
      "No. Live train status only needs the train number or name. Use PNR status when you want confirmation, coach, and berth details for a booked ticket.",
  },
  {
    question: "How accurate is live train status on Train Dekho?",
    answer:
      "Live status is based on Indian Railways / NTES running information and updates through the journey. Brief gaps can happen when the feed is delayed. For the planned timetable, open the train's schedule page.",
  },
  {
    question: "Can I get alerts when my train is delayed or approaching?",
    answer:
      "Yes, in the Train Dekho Android app. Turn on live status alerts to get a push notification for delays and when the train is approaching your station.",
  },
  {
    question: "How is live status different from a train schedule?",
    answer:
      "A schedule is the planned timetable — stations, arrival and departure times, and running days. Live status is where the train is now, including delay and actual timings at stations already crossed.",
  },
];

export function buildLiveTrainStatusFaq(
  data: TrainLiveStatusResponse,
): FaqItem[] {
  const trainNo = String(data.train_no);
  const trainLabel = `${trainNo} ${titleCase(data.train_name)}`;
  const currentCode = data.live_train_status.currentStation?.trim();
  const upcomingCode = data.live_train_status.upcomingStation?.trim();
  const delayMinutes = getTrainDelayMinutes(data);
  const delayText =
    delayMinutes == null
      ? data.live_train_status.running_status || "the latest running information"
      : formatTrainDelayMessage(delayMinutes);

  const locationAnswer = currentCode
    ? `Train ${trainNo} was last reported at ${currentCode}${
        upcomingCode ? `, with ${upcomingCode} as the next station` : ""
      }. Current running status: ${delayText}.`
    : `Live running status for train ${trainNo} is ${delayText}. Open this page to see the latest station and delay.`;

  return [
    {
      question: `How do I check live status of train ${trainNo}?`,
      answer: `Search ${trainLabel} on Train Dekho Live Train Status to see its current location, delay, and station-wise actual times. You can also share live status from the Android app.`,
    },
    {
      question: `Where is train ${trainNo} right now?`,
      answer: locationAnswer,
    },
    {
      question: `Is train ${trainNo} running on time?`,
      answer: `Live status currently shows ${trainLabel} as ${delayText}. Delay can change during the journey, so refresh this page or turn on alerts in the app.`,
    },
    {
      question: `What is the route of train ${trainNo}?`,
      answer: `${trainLabel} runs from ${data.source} (${data.source_code}) to ${data.destination} (${data.destination_code}) with ${data.total_number_of_stops} stops. Use Full schedule on this page for the complete timetable.`,
    },
    {
      question: `How often is live status for train ${trainNo} updated?`,
      answer: `Live running status for train ${trainNo} is fetched from Indian Railways data when you open or refresh this page. Use the refresh button for the latest location and delay.`,
    },
    {
      question: `Can I get alerts for train ${trainNo}?`,
      answer: `Yes. In the Train Dekho Android app, open live status for train ${trainNo} and turn on alerts for delays and station arrivals.`,
    },
  ];
}

export function buildLiveTrainStatusFaqFromListItem(
  train: TrainListItem,
): FaqItem[] {
  const trainNo = String(train.train_no);
  const name = titleCase(train.train_name);
  const trainLabel = name ? `${trainNo} ${name}` : `train ${trainNo}`;
  const from = train.source_code?.trim();
  const to = train.destination_code?.trim();
  const route =
    from && to
      ? ` It runs from ${train.source ?? from} (${from}) to ${train.destination ?? to} (${to}).`
      : "";

  return [
    {
      question: `How do I check live status of train ${trainNo}?`,
      answer: `Enter ${trainLabel} on Train Dekho Live Train Status to see current location, delay in minutes, and station-by-station progress.${route}`,
    },
    {
      question: `Do I need a PNR to track train ${trainNo}?`,
      answer: `No. Live status for train ${trainNo} only needs the train number or name. PNR is for ticket confirmation, coach, and berth.`,
    },
    {
      question: `How is live status different from the schedule of train ${trainNo}?`,
      answer: `The schedule is the planned timetable for ${trainLabel}. Live status shows where it is now, including delay and actual halt times.`,
    },
    {
      question: `Can I get alerts for train ${trainNo}?`,
      answer: `Yes. In the Train Dekho Android app, open live status for train ${trainNo} and turn on alerts for delays and when the train approaches your station.`,
    },
  ];
}

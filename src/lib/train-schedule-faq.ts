import {
  formatDuration,
  formatRunningDays,
  formatScheduleTime,
  titleCase,
} from "@/lib/format";
import type { Train } from "@/lib/types/train";

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildTrainScheduleFaq(train: Train): FaqItem[] {
  const trainLabel = `${train.train_no} ${titleCase(train.train_name)}`;
  const firstStop = train.schedule[0];
  const lastStop = train.schedule[train.schedule.length - 1];
  const departure = formatScheduleTime(firstStop?.scheduledDepartureTime ?? "—");
  const arrival = formatScheduleTime(lastStop?.scheduledArrivalTime ?? "—");
  const duration = formatDuration(train.total_duration);
  const runningDays = formatRunningDays(train.days_of_run);
  const classes =
    train.classes.length > 0
      ? train.classes.join(", ")
      : "standard Indian Railways classes";

  return [
    {
      question: `What is the route of train ${train.train_no}?`,
      answer: `${trainLabel} runs from ${train.source} (${train.source_code}) to ${train.destination} (${train.destination_code}), covering ${train.total_distance} with ${train.total_number_of_stops} stops.`,
    },
    {
      question: `What are the departure and arrival times for train ${train.train_no}?`,
      answer: `Train ${train.train_no} departs ${train.source_code} at ${departure} and arrives ${train.destination_code} at ${arrival}. The total journey time is ${duration}.`,
    },
    {
      question: `On which days does train ${train.train_no} run?`,
      answer: `Train ${train.train_no} runs on ${runningDays}.`,
    },
    {
      question: `How many stations does train ${train.train_no} stop at?`,
      answer: `Train ${train.train_no} halts at ${train.total_number_of_stops} stations between ${train.source_code} and ${train.destination_code}. The full station-wise timetable is listed on this page.`,
    },
    {
      question: `What type of train is ${train.train_no} ${titleCase(train.train_name)}?`,
      answer: `Train ${train.train_no} is a ${train.train_type} service operated by Indian Railways on the ${train.source_code}–${train.destination_code} route.`,
    },
    {
      question: `What travel classes are available on train ${train.train_no}?`,
      answer: `Train ${train.train_no} offers ${classes} class bookings.`,
    },
    {
      question: `How can I track train ${train.train_no} live?`,
      answer: `Use Train Dekho's Live Train Status to see the real-time location, delay in minutes, and station-by-station progress for train ${train.train_no}.`,
    },
  ];
}

export const TRAIN_SCHEDULE_INDEX_FAQ: FaqItem[] = [
  {
    question: "How do I find a train schedule on Train Dekho?",
    answer:
      "Enter a train number or name in the search box. You'll get the full station-wise timetable with arrival and departure times, distance, running days, and travel classes.",
  },
  {
    question: "What details are shown in a train schedule?",
    answer:
      "Each schedule page shows the origin and destination, departure and arrival times, total duration and distance, running days, available classes, and every halt with scheduled timings.",
  },
  {
    question: "Are Indian Railways train schedules accurate on Train Dekho?",
    answer:
      "Schedules are based on Indian Railways timetable data and are updated regularly. For live delays and the train's current position, use the Live Train Status feature.",
  },
  {
    question:
      "Can I check schedules for Rajdhani, Shatabdi, and Vande Bharat trains?",
    answer:
      "Yes. Train Dekho covers all Indian Railways trains including Rajdhani, Shatabdi, Duronto, Vande Bharat, Mail/Express, and passenger services.",
  },
];

export function buildFaqPageJsonLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

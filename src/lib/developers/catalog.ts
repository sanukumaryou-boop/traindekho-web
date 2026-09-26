import { standardErrors, type ApiResponseExample } from "@/lib/developers/responses";

export type ApiParameter = {
  name: string;
  in: "path" | "query";
  required: boolean;
  description: string;
};

export type ApiEndpoint = {
  slug: string;
  group: "Trains" | "Stations" | "Routes";
  method: "GET";
  path: string;
  summary: string;
  description: string;
  parameters: ApiParameter[];
  examplePath: string;
  success: ApiResponseExample;
  errorStatuses: number[];
};

export const API_BASE_URL = "https://api.traindekho.live/v1";

export type PublicPlan = {
  code: string;
  name: string;
  price: string | null;
  daily: number | null;
  monthly: number | null;
  perMinute: number | null;
  contact: string | null;
};

export const API_PLANS: PublicPlan[] = [
  { code: "free", name: "Free", price: "₹0", daily: 100, monthly: 1000, perMinute: 10, contact: null },
  { code: "basic", name: "Basic", price: "₹499", daily: 2000, monthly: 20000, perMinute: 30, contact: null },
  { code: "startup", name: "Startup", price: "₹1,999", daily: 5000, monthly: 100000, perMinute: 60, contact: null },
  { code: "growth", name: "Growth", price: "₹4,999", daily: 10000, monthly: 300000, perMinute: 180, contact: null },
  { code: "custom", name: "Enterprise", price: null, daily: null, monthly: null, perMinute: null, contact: "ankit@traindekho.live" },
];

const planCount = new Intl.NumberFormat("en-IN");

export function formatPlanCount(value: number) {
  return planCount.format(value);
}

const sharedPlanFeatures = [
  "Train search and train details",
  "Live status, delay, and next station",
  "Schedules, platforms, and running days",
  "Nearby stations and trains at a station",
  "Direct trains between two stations",
];

export function planIncluded(plan: PublicPlan) {
  return [
    ...sharedPlanFeatures,
    plan.daily === null ? null : `${formatPlanCount(plan.daily)} requests / day`,
    plan.monthly === null ? null : `${formatPlanCount(plan.monthly)} requests / month`,
    plan.perMinute === null ? null : `${formatPlanCount(plan.perMinute)} requests / minute`,
    plan.contact ? "Limits set for your traffic" : null,
  ].filter((item): item is string => item !== null);
}

const withNotFound = [...standardErrors.slice(0, 3), 404, ...standardErrors.slice(3)];

export const apiEndpoints: ApiEndpoint[] = [
  {
    slug: "search-trains",
    group: "Trains",
    method: "GET",
    path: "/trains",
    summary: "Search trains",
    description: "Search trains by name or number. Results are ordered by relevance.",
    parameters: [
      { name: "q", in: "query", required: true, description: "Train number, train name, station code, or station name." },
      { name: "limit", in: "query", required: false, description: "Maximum results, from 1 to 25. Defaults to 10." },
    ],
    examplePath: "/trains?q=rajdhani&limit=10",
    errorStatuses: standardErrors,
    success: {
      status: 200,
      description: "Matching trains, highest relevance first.",
      example: JSON.stringify(
        {
          trains: [
            {
              train_no: "12951",
              name: "Mumbai Rajdhani",
              type: "RAJ",
              origin: { code: "MMCT", name: "Mumbai Central" },
              destination: { code: "NDLS", name: "New Delhi" },
            },
          ],
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "train-details",
    group: "Trains",
    method: "GET",
    path: "/trains/{train_no}",
    summary: "Train details",
    description: "Returns the public identity and schedule summary for one train.",
    parameters: [{ name: "train_no", in: "path", required: true, description: "Train number, four or five digits." }],
    examplePath: "/trains/12951",
    errorStatuses: withNotFound,
    success: {
      status: 200,
      description: "Train details.",
      example: JSON.stringify(
        {
          train_no: "12951",
          name: "Mumbai Rajdhani",
          type: "RAJ",
          origin: { code: "MMCT", name: "Mumbai Central" },
          destination: { code: "NDLS", name: "New Delhi" },
          days_of_run: { sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true },
          classes: ["1A", "2A", "3A"],
          duration_minutes: 980,
          distance_km: 1384,
          stop_count: 8,
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "train-schedule",
    group: "Trains",
    method: "GET",
    path: "/trains/{train_no}/schedule",
    summary: "Train schedule",
    description: "Returns the scheduled stops for one train, including intermediate stations.",
    parameters: [{ name: "train_no", in: "path", required: true, description: "Train number, four or five digits." }],
    examplePath: "/trains/12951/schedule",
    errorStatuses: withNotFound,
    success: {
      status: 200,
      description: "Scheduled stops, including intermediate stations.",
      example: JSON.stringify(
        {
          train: {
            train_no: "12951",
            name: "Mumbai Rajdhani",
            type: "RAJ",
            origin: { code: "MMCT", name: "Mumbai Central" },
            destination: { code: "NDLS", name: "New Delhi" },
            days_of_run: { sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true },
            classes: ["1A", "2A", "3A"],
            duration_minutes: 980,
            distance_km: 1384,
            stop_count: 8,
          },
          stops: [
            {
              sequence: 1,
              station: { code: "MMCT", name: "Mumbai Central" },
              arrival_time: null,
              departure_time: "17:05",
              day_offset: 0,
              distance_km: 0,
              platform: "1",
              halt_minutes: 0,
              lat: 18.969,
              lon: 72.819,
              intermediate_stations: [],
            },
          ],
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "live-status",
    group: "Trains",
    method: "GET",
    path: "/trains/{train_no}/live-status",
    summary: "Live train status",
    description: "Returns the current station, the next station, delay, and live times for a journey date.",
    parameters: [
      { name: "train_no", in: "path", required: true, description: "Train number, four or five digits." },
      { name: "date", in: "query", required: true, description: "Journey date, YYYY-MM-DD." },
    ],
    examplePath: "/trains/12951/live-status?date=2026-09-24",
    errorStatuses: [...withNotFound, 502],
    success: {
      status: 200,
      description: "Current station, next station, and the schedule with live times.",
      example: JSON.stringify(
        {
          train_no: "12951",
          journey_date: "2026-09-23",
          running_status: "departed",
          data_source: "ntes",
          delay_minutes: 12,
          current_station: { code: "BRC", name: "Vadodara Junction" },
          next_station: { code: "NDLS", name: "New Delhi", distance_km: 992 },
          stops: [
            {
              sequence: 1,
              station: { code: "MMCT", name: "Mumbai Central" },
              scheduled_arrival_time: null,
              scheduled_departure_time: "17:05",
              actual_arrival_time: null,
              actual_departure_time: "17:17",
              day_offset: 0,
              distance_km: 0,
              halt_minutes: 0,
              lat: 18.969,
              lon: 72.819,
              intermediate_stations: [],
              delay_minutes: 12,
              coach_position: "ENG-SLR-S1",
            },
          ],
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "search-stations",
    group: "Stations",
    method: "GET",
    path: "/stations",
    summary: "Search stations",
    description: "Search stations by name or code.",
    parameters: [
      { name: "q", in: "query", required: true, description: "Station code or station name." },
      { name: "limit", in: "query", required: false, description: "Maximum results, from 1 to 25. Defaults to 10." },
    ],
    examplePath: "/stations?q=new%20delhi&limit=10",
    errorStatuses: standardErrors,
    success: {
      status: 200,
      description: "Matching stations.",
      example: JSON.stringify(
        { stations: [{ code: "NDLS", name: "New Delhi", lat: 28.643, lon: 77.219, weight: 100 }] },
        null,
        2,
      ),
    },
  },
  {
    slug: "nearby-stations",
    group: "Stations",
    method: "GET",
    path: "/stations/nearby",
    summary: "Nearby stations",
    description: "Returns stations inside a radius of a point, highest weight first.",
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude, from -90 to 90." },
      { name: "lon", in: "query", required: true, description: "Longitude, from -180 to 180." },
      { name: "radius_km", in: "query", required: false, description: "Search radius in kilometres, from 1 to 100. Defaults to 25." },
      { name: "limit", in: "query", required: false, description: "Maximum results, from 1 to 25. Defaults to 10." },
    ],
    examplePath: "/stations/nearby?lat=28.6139&lon=77.209&radius_km=25",
    errorStatuses: standardErrors,
    success: {
      status: 200,
      description: "Stations inside the radius, highest weight first.",
      example: JSON.stringify(
        {
          stations: [
            {
              station: { code: "NDLS", name: "New Delhi", lat: 28.643, lon: 77.219, weight: 100 },
              distance_km: 3.4,
            },
          ],
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "station-details",
    group: "Stations",
    method: "GET",
    path: "/stations/{code}",
    summary: "Station details",
    description: "Returns one station.",
    parameters: [{ name: "code", in: "path", required: true, description: "Station code." }],
    examplePath: "/stations/NDLS",
    errorStatuses: withNotFound,
    success: {
      status: 200,
      description: "Station details.",
      example: JSON.stringify({ code: "NDLS", name: "New Delhi", lat: 28.643, lon: 77.219, weight: 100 }, null, 2),
    },
  },
  {
    slug: "station-trains",
    group: "Stations",
    method: "GET",
    path: "/stations/{code}/trains",
    summary: "Trains at a station",
    description: "Lists trains that depart this station or arrive at it.",
    parameters: [
      { name: "code", in: "path", required: true, description: "Station code." },
      { name: "direction", in: "query", required: true, description: "from lists departing trains. to lists arriving trains." },
    ],
    examplePath: "/stations/NDLS/trains?direction=from",
    errorStatuses: withNotFound,
    success: {
      status: 200,
      description: "Trains calling at the station in the requested direction.",
      example: JSON.stringify(
        {
          station: { code: "NDLS", name: "New Delhi" },
          direction: "from",
          trains: [{ train_no: "12952", name: "Mumbai Rajdhani", arrival_time: null, departure_time: "16:55", day_offset: 0 }],
        },
        null,
        2,
      ),
    },
  },
  {
    slug: "trains-between-stations",
    group: "Routes",
    method: "GET",
    path: "/routes/trains",
    summary: "Trains between stations",
    description: "Lists direct trains between two stations, in departure-time order, plus alternatives that board or alight nearby.",
    parameters: [
      { name: "from", in: "query", required: true, description: "Origin station code." },
      { name: "to", in: "query", required: true, description: "Destination station code." },
      { name: "date", in: "query", required: false, description: "When set, only trains that run on this journey date are returned." },
    ],
    examplePath: "/routes/trains?from=NDLS&to=MMCT",
    errorStatuses: standardErrors,
    success: {
      status: 200,
      description: "Direct trains in departure-time order, plus alternatives that board or alight nearby.",
      example: JSON.stringify(
        {
          direct_trains: [
            {
              train_no: "12951",
              name: "Mumbai Rajdhani",
              type: "RAJ",
              departure_time: "17:05",
              arrival_time: "08:32",
              duration_minutes: 927,
              distance_km: 1384,
              day_offset: 1,
              days_of_run: { sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true },
              classes: ["1A", "2A", "3A"],
              stops_between: 6,
            },
          ],
          alternatives: [],
        },
        null,
        2,
      ),
    },
  },
];

export const apiGroups = ["Trains", "Stations", "Routes"] as const;

export function endpointBySlug(slug: string) {
  return apiEndpoints.find((endpoint) => endpoint.slug === slug);
}

export function curlExample(endpoint: ApiEndpoint) {
  return `curl "${API_BASE_URL}${endpoint.examplePath}" \\\n  -H "X-API-Key: YOUR_API_KEY"`;
}

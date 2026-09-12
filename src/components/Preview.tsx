"use client";

import { useEffect, useRef, useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";

const AUTO_MS = 4000;

const screens = [
  {
    src: "/images/screenshot-search.png",
    alt: "Train Dekho live train status home — search by route or train number",
    title: "Search trains in seconds",
    description:
      "Find trains between stations or by name and number. Recent searches stay one tap away so you can track the same train again without typing.",
    points: [
      "Search by origin and destination",
      "Search by train name or number",
      "Jump back into recent searches",
    ],
  },
  {
    src: "/images/screenshot-route-live.png",
    alt: "Direct and alternative trains from New Delhi to Kanpur with Live Status",
    title: "Direct & alternative trains",
    description:
      "See every direct train on your route, then switch to Alternative for connecting options — with live status on each card.",
    points: [
      "Direct trains with timings and classes",
      "Alternative trains when a direct one does not work",
      "Tap Live Status from the same list",
    ],
  },
  {
    src: "/images/screenshot-live-status.png",
    alt: "Live running status timeline with delay, upcoming stations, and Share Live Status",
    title: "Live status, station by station",
    description:
      "Follow delay, distance to the next stop, and the full arrival–departure timeline. Share it with family in one tap.",
    points: [
      "Current delay and next station",
      "Station-wise arrival and departure",
      "Share live status instantly",
    ],
  },
  {
    src: "/images/screenshot-book-ticket.png",
    alt: "Book Ticket on route search results, with a notice when a train has already departed",
    title: "Book tickets from the train list",
    description:
      "Book the train you want without leaving the results. If it has already departed, the app tells you to pick another date or train.",
    points: [
      "Book Ticket on every eligible train",
      "Clear notice when a train has left",
      "Choose another date or an alternative",
    ],
  },
  {
    src: "/images/screenshot-alternatives.png",
    alt: "Seat availability with suggested alternative trains and Book Now",
    title: "Suggested trains while you book",
    description:
      "Checking availability on a waitlisted or full train? Train Dekho recommends other trains on the same route with seats and fare — then Book Now.",
    points: [
      "Class-wise availability for upcoming days",
      "Suggested trains with AVL/WL and fare",
      "Book Now without starting a new search",
    ],
  },
];

export default function Preview() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    if (!deadlineRef.current) {
      deadlineRef.current = Date.now() + AUTO_MS;
    }
    const remaining = Math.max(50, deadlineRef.current - Date.now());
    const timer = window.setTimeout(() => {
      deadlineRef.current = 0;
      setIndex((current) => (current + 1) % screens.length);
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [index, paused]);

  function handleHover(nextPaused: boolean) {
    if (nextPaused && !window.matchMedia("(hover: hover)").matches) return;
    setPaused(nextPaused);
  }

  return (
    <section
      id="preview"
      className="py-20 sm:py-24 bg-white"
      aria-labelledby="preview-heading"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mb-3">
          App preview
        </p>
        <h2
          id="preview-heading"
          className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-10 sm:mb-14 max-w-2xl"
        >
          From search to booking, as it works in the app
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative min-h-[20rem] sm:min-h-[18rem]" aria-live="polite">
              {screens.map((item, i) => {
                const active = i === index;
                return (
                  <div
                    key={item.src}
                    className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                      active
                        ? "relative opacity-100 translate-y-0"
                        : "pointer-events-none absolute inset-x-0 top-0 opacity-0 translate-y-4"
                    }`}
                    aria-hidden={!active}
                  >
                    <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">
                      {item.description}
                    </p>
                    <ul className="space-y-2.5">
                      {item.points.map((point, pointIndex) => (
                        <li
                          key={point}
                          className={`flex gap-2.5 text-sm text-gray-600 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                            active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                          }`}
                          style={{
                            transitionDelay: active ? `${180 + pointIndex * 90}ms` : "0ms",
                          }}
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-56 sm:w-64">
              {screens.map((item, i) => {
                const active = i === index;
                return (
                  <div
                    key={item.src}
                    className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                      active
                        ? "relative opacity-100 translate-y-0 scale-100"
                        : "pointer-events-none absolute inset-0 opacity-0 translate-y-5 scale-[0.98]"
                    }`}
                    aria-hidden={!active}
                  >
                    <PhoneFrame src={item.src} alt={item.alt} className="w-full" priority />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

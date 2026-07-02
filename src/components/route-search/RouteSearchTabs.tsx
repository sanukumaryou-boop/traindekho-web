"use client";

import { useState } from "react";
import RouteTrainCard from "@/components/route-search/RouteTrainCard";
import {
  getAlightStation,
  getBoardStation,
  type AlternativeRouteTrain,
  type DirectRouteTrain,
} from "@/lib/types/route-search";

type RouteSearchTabsProps = {
  directTrains: DirectRouteTrain[];
  alternativeTrains: AlternativeRouteTrain[];
};

type Tab = "direct" | "alternative";

export default function RouteSearchTabs({
  directTrains,
  alternativeTrains,
}: RouteSearchTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>(
    directTrains.length > 0 ? "direct" : "alternative",
  );

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "direct", label: "Direct Trains", count: directTrains.length },
    {
      id: "alternative",
      label: "Alternative Trains",
      count: alternativeTrains.length,
    },
  ];

  const activeTrains =
    activeTab === "direct" ? directTrains : alternativeTrains;

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Train route results"
        className="flex rounded-xl border border-gray-200 bg-gray-50/80 p-1"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`route-panel-${tab.id}`}
              id={`route-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  selected ? "bg-gray-100 text-gray-700" : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`route-panel-${activeTab}`}
        aria-labelledby={`route-tab-${activeTab}`}
        className="mt-4"
      >
        {activeTab === "direct" && (
          <p className="mb-4 text-sm text-gray-500">
            Trains that stop at both stations on this route.
          </p>
        )}
        {activeTab === "alternative" && (
          <p className="mb-4 text-sm text-gray-500">
            Board at a nearby station when no direct service is available from your
            chosen origin.
          </p>
        )}

        {activeTrains.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-600 text-center">
            {activeTab === "direct"
              ? "No direct trains on this route."
              : "No alternative trains on this route."}
          </p>
        ) : (
          <ul className="space-y-3">
            {activeTrains.map((train) => {
              const board = getBoardStation(train, activeTab);
              const alight = getAlightStation(train, activeTab);
              return (
              <li
                key={`${activeTab}-${train.train_no}-${board.station_code}-${alight.station_code}`}
              >
                <RouteTrainCard train={train} variant={activeTab} />
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

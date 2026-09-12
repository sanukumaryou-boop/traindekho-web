import TrainSearch from "@/components/TrainSearch";
import TrainScheduleLiveStatusLink from "@/components/train-schedule/TrainScheduleLiveStatusLink";
import PlayStoreButton from "@/components/PlayStoreButton";

type TrainScheduleActionsProps = {
  showSearch?: boolean;
  trainNo?: number;
  description?: string;
};

export default function TrainScheduleActions({
  showSearch = true,
  trainNo,
  description,
}: TrainScheduleActionsProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 ${
        showSearch ? "lg:grid-cols-2" : ""
      } ${trainNo ? "xl:grid-cols-3" : ""}`}
    >
      {trainNo && (
        <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 to-blue-700 p-5 sm:p-6 text-white shadow-sm">
          <h2 className="text-base font-bold mb-1">Live running status</h2>
          <p className="text-sm text-blue-100 mb-4">
            See where train {trainNo} is right now — current location, delays,
            and station-wise updates.
          </p>
          <TrainScheduleLiveStatusLink
            trainNo={trainNo}
            variant="light"
            className="w-full sm:w-auto"
          />
        </section>
      )}

      {showSearch && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Check other trains
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Search by train number or name.
          </p>
          <TrainSearch />
        </section>
      )}

      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/30 p-5 sm:p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          Download the app
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {description ??
            (trainNo
              ? `Live tracking, delay alerts & more for train ${trainNo}.`
              : "Live train tracking, route search & delay alerts on Android.")}
        </p>
        <PlayStoreButton
          placement="schedule"
          medium="web"
          variant="primary"
          label="Get it on Google Play"
          className="!px-5 !py-2.5 !text-sm !rounded-full"
        />
      </section>
    </div>
  );
}


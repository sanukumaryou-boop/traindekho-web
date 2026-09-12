import TrainScheduleFAQ from "@/components/train-schedule/TrainScheduleFAQ";
import { HOMEPAGE_FAQ } from "@/lib/homepage-faq";

export default function HomepageFAQ() {
  return (
    <section className="py-20 sm:py-24 bg-gray-50" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mb-3">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight"
          >
            Questions travellers ask
          </h2>
        </div>
        <TrainScheduleFAQ items={HOMEPAGE_FAQ} heading="" />
      </div>
    </section>
  );
}

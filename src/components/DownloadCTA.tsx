import Image from "next/image";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className}>
      <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
      <path fill="#4285F4" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
      <path fill="#FBBC04" d="M425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c17.1-9.8 17.1-35.1-.1-44.9z" />
      <path fill="#34A853" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

export default function DownloadCTA() {
  return (
    <section
      id="download"
      className="py-20 sm:py-28 bg-gray-50 scroll-mt-16"
      aria-labelledby="download-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Image
          src="/images/logo.png"
          alt="Train Dekho"
          width={72}
          height={72}
          className="mx-auto mb-6 rounded-2xl shadow-lg"
        />

        <h2
          id="download-heading"
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          Download Train Dekho — It&apos;s Free
        </h2>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join millions of Indian travellers who rely on Train Dekho every day.
          Available on Android.
        </p>

        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Train Dekho on Google Play"
          className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base"
        >
          <GooglePlayIcon className="w-6 h-6 flex-shrink-0" />
          Download on Google Play
        </a>

        <p className="mt-8 text-gray-400 text-sm">
          Free to download &amp; use &nbsp;·&nbsp; No sign-up required &nbsp;·&nbsp; Android
        </p>
      </div>
    </section>
  );
}

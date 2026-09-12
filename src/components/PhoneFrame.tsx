import Image from "next/image";

type PhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function PhoneFrame({
  src,
  alt,
  className = "",
  priority = false,
}: PhoneFrameProps) {
  return (
    <div className={className}>
      <div className="rounded-[2.2rem] overflow-hidden border-[5px] border-gray-200 bg-gray-900 shadow-xl">
        <Image
          src={src}
          alt={alt}
          width={360}
          height={720}
          className="w-full h-auto"
          priority={priority}
        />
      </div>
    </div>
  );
}

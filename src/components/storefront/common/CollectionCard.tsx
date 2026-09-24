import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "./ArrowIcon";

interface CollectionCardProps {
  name: string;
  count: string;
  images: string[];
  href: string;
}

export default function CollectionCard({
  name,
  count,
  images,
  href,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className="block cursor-pointer group"
      aria-label={`Open ${name}`}
    >
      {/* Images Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3 overflow-hidden rounded-2xl">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="h-40 w-full overflow-hidden sm:h-44 md:h-36 lg:h-40"
          >
            <Image
              src={src}
              alt={`${name} perfume ${idx + 1}`}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              fetchPriority="high"
            />
          </div>
        ))}
      </div>

      {/* Info Row */}
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-heading text-base sm:text-lg">{name}</h3>
          <p className="text-xs text-textSecondary sm:text-sm">{count}</p>
        </div>
        <div
          className={`ml-auto flex shrink-0 items-center justify-center rounded-full border border-textPrimary p-2 
          transition-all duration-300 ease-in-out group-hover:bg-textPrimary`}
        >
          <ArrowIcon
            className="text-textPrimary transition-colors duration-300 group-hover:text-white"
            size={16}
          />
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "./common/ArrowIcon";

export default function CategorySection() {
    const categories = [
        {
            title: "MEN'S FRAGRANCES",
            subtitle: "Best Men's Collection",
            href: "/shop/men",
            highlight: false,
        },
        {
            title: "WOMEN'S FRAGRANCES",
            subtitle: "Best Women's Collection",
            href: "/shop/women",
            highlight: false,
        },
        {
            title: "UNISEX SCENTS",
            subtitle: "Special Scents",
            href: "/collections/unisex",
            highlight: false,
        },
        {
            title: "LUXURY COLLECTION",
            subtitle: "Luxury Scent for Both",
            href: "/collections/luxury",
            highlight: false,
        },
    ];

    return (
        <section
            className="pt-8 text-textPrimary sm:pt-10 md:pt-12"
            id="categories"
        >
            <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-3 px-4">
                <h2 className="font-heading text-lg font-semibold uppercase tracking-wider sm:text-xl">
                    Categories
                </h2>
                <Link
                    href="/collections"
                    className="inline-flex shrink-0 items-center gap-2 rounded-pill border bg-[#3b3b3b] py-1 pl-3 pr-1 text-xs text-white transition sm:pl-4 sm:text-sm"
                >
                    View All  <div className="bg-white rounded-full p-2 flex items-center justify-center">
                        <ArrowIcon className="text-textPrimary" size={16} />

                    </div>
                </Link>
            </div>
            <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 sm:gap-6 sm:px-6 lg:flex-row lg:items-center lg:gap-10">

                {/* Left Image */}
                <div className="flex justify-center lg:justify-start">
                    <Image
                        src="/images/upscalemedia-transformed.png"
                        alt="Luxury amber perfume bottle on pastel stairs"
                        width={380}
                        height={420}
                        className="h-auto w-full max-w-[220px] rounded-soft object-cover shadow-img sm:max-w-[300px]"
                        priority
                    />
                </div>

                {/* Right Section */}
                <div className="flex-1">
                    {/* Category List */}
                    <div className="space-y-4">
                        {categories.map((cat, i) => (
                            <div
                                key={i}
                                className="group flex items-center justify-between gap-3 border-b border-[#d6c6a1] pb-3"
                            >
                                <div className="min-w-0">
                                    <Link href={cat.href}>
                                        <h3 className="font-heading text-sm tracking-wide text-textPrimary transition-colors group-hover:text-accent sm:text-lg">
                                            {cat.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-textSecondary sm:text-[13px]">{cat.subtitle}</p>
                                    </Link>

                                </div>

                                <Link
                                    href={cat.href}
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition 
                                         border-borderRing text-textPrimary group-hover:bg-textPrimary group-hover:text-white                                        `}
                                >
                                    <ArrowIcon size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Brand Section */}
            <div className="bg-[var(--color-textPrimary)] text-[var(--color-pageBg)] text-center mt-14 py-10 px-5 sm:px-6 md:mt-16 md:py-12">
                <p className="max-w-xl mx-auto text-base leading-relaxed font-heading tracking-wide sm:text-lg">
                    AT{" "}
                    <span className="text-accent font-semibold">
                        SCENTORA
                    </span>
                    , WE BELIEVE FRAGRANCE IS MORE THAN JUST A SCENT — IT’S AN EXPERIENCE.
                    OUR PERFUMES ARE CRAFTED WITH THE FINEST INGREDIENTS, BLENDING
                    TRADITION AND MODERN ARTISTRY TO CREATE UNFORGETTABLE FRAGRANCES.
                </p>

                <Link
                    href="/about"
                    className="mt-8 inline-flex items-center gap-2 border rounded-pill pl-4 pr-1 py-1 text-sm bg-white text-textPrimary transition"
                >
                    Learn More
                    <div className="bg-textPrimary rounded-full p-3 flex items-center justify-center">
                        <ArrowIcon className="text-white" size={16} />

                    </div>
                </Link>
            </div>
        </section>
    );
}


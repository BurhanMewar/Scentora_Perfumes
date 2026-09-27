import Image from "next/image";
import { Leaf, Flower2, Recycle } from "lucide-react";

// export const metadata = {
//     title: "Experience Luxury & Elegance | Scentora Perfumes",
//     description:
//         "Discover the essence of luxury with Scentora perfumes — long-lasting fragrances crafted from natural ingredients in sustainable packaging.",
//     keywords: [
//         "Luxury perfume",
//         "Natural fragrances",
//         "Sustainable perfumes",
//         "Amber scent",
//         "Scentora Kuwait",
//     ],
//     openGraph: {
//         title: "Experience Luxury & Elegance | Scentora",
//         description:
//             "Elevate your senses with long-lasting, natural, and sustainable fragrances by Scentora.",
//         type: "website",
//         url: "https://yourdomain.com",
//         images: [
//             {
//                 url: "https://yourdomain.com/og-experience.jpg",
//                 width: 1200,
//                 height: 630,
//                 alt: "Luxury fragrance bottle and model applying perfume",
//             },
//         ],
//     },
// };

export default function ExperienceSection() {
    const features = [
        {
            id: 1,
            icon: <Flower2 className="w-full h-full text-accent" />,
            title: "Long-Lasting Fragrance",
            desc: "Enjoy all-day freshness with premium essential oils.",
        },
        {
            id: 2,
            icon: <Leaf className="w-full h-full text-accent" />,
            title: "Finest Natural Ingredients",
            desc: "Crafted with rare and high-quality extracts for a luxurious scent.",
        },
        {
            id: 3,
            icon: <Recycle className="w-full h-full text-accent" />,
            title: "Sustainable & Ethical",
            desc: "Eco-friendly packaging and responsibly sourced materials.",
        },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Brand",
        name: "Scentora",
        slogan: "Experience Luxury & Elegance",
        description:
            "Premium fragrances combining long-lasting freshness, natural ingredients, and sustainable packaging.",
        logo: "https://yourdomain.com/logo.png",
        sameAs: [
            "https://www.instagram.com/scentora",
            "https://www.facebook.com/scentora",
        ],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Fragrance Features",
            itemListElement: features.map((f, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: f.title,
                description: f.desc,
            })),
        },
    };

    return (
        <section
            id="experience"
            className="  text-textPrimary "
            aria-labelledby="experience-heading"
        >
            <div className="mx-auto flex max-w-[1100px] flex-col justify-between gap-6 lg:flex-row md:gap-10">
                {/* --- Left Text Content --- */}
                <div className="flex-1">
                    <h2
                        id="experience-heading"
                        className="text-2xl font-heading leading-tight sm:text-3xl md:text-4xl"
                    >
                        EXPERIENCE LUXURY <span className="font-normal">&</span> ELEGANCE
                    </h2>
                    <p className="text-textPrimary font-medium  max-w-md">
                        Our fragrances are crafted to elevate your senses and leave a lasting impression.
                    </p>

                    <ul className="mt-5 space-y-4 sm:mx-5 sm:mt-6" aria-label="Fragrance highlights">
                        {features.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-start gap-3 sm:gap-5"
                                itemScope
                                itemType="https://schema.org/ListItem"
                            >
                                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10" aria-hidden="true">
                                    {item.icon}
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-accent font-semibold ">
                                        {item.title}
                                    </h3>
                                    <p className="text-textPrimary font-medium text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Right Image Composition --- */}
                <div className="relative mx-auto h-[300px] w-[220px] md:h-[390px] md:w-[300px]">
                    {/* Inner Circular Bottle Image */}
                    <div className="absolute -left-8 bottom-12 z-10 h-[180px] w-32 p-2 sm:-left-14 md:-left-20 md:bottom-14 md:h-[260px] md:w-[200px]">
                        <div className="relative w-full h-full rounded-full overflow-hidden ">
                            <Image
                                src="/images/perfume-bottle-sand.webp"
                                alt="Amber perfume bottle lying on sand"
                                fill
                                className="object-center"
                                loading="lazy"
                            />
                        </div>
                        {/* Decorative outline ring */}
                        <div className="absolute inset-0 rounded-full border border-borderRing " />
                    </div>

                    {/* Main Model Image */}
                    <div className="relative w-full h-full rounded-4xl overflow-hidden shadow-img">
                        <Image
                            src="/images/about-bg.webp"
                            alt="SCENTORA premium fragrance experience"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section >
    );
}


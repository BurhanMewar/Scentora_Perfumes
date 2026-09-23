"use client";

export default function Newsletter() {
  return (
    <section className="mx-auto w-full max-w-[1150px] px-4">
      <div className="bg-linear-to-br flex-1 from-[#1A1A1A] to-[#2E2E2E] rounded-4xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="font-heading text-2xl leading-snug text-white mb-6 sm:text-3xl md:text-4xl">
            STAY UPDATED WITH <br /> OUR NEWSLETTER
          </h2>

          <div className="flex w-full max-w-md items-center overflow-hidden rounded-full bg-white">
            <input
              type="email"
              placeholder="Enter your mail address"
              className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
            />
            <button             className="mr-1 shrink-0 rounded-full bg-black px-3 py-2 text-xs font-medium text-white sm:px-4 sm:text-sm">
              Subscribe
            </button>
          </div>
        </div>

        {/* Right Section */}
        <p className="text-gray-300 text-sm md:max-w-xs">
          Be the first to know about exclusive offers, new arrivals, and special deals!
        </p>
      </div>
    </section>
  );
}

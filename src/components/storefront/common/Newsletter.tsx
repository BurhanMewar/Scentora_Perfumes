"use client";

export default function Newsletter() {
  return (
    <section className="mx-auto w-full max-w-[1150px] px-4">
      <div className="flex flex-1 flex-col items-center justify-between gap-5 rounded-3xl bg-linear-to-br from-[#1A1A1A] to-[#2E2E2E] p-5 sm:p-7 md:flex-row md:gap-8 md:p-9">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="mb-4 font-heading text-xl leading-snug text-white sm:text-2xl md:text-3xl">
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

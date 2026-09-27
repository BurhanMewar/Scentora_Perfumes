import Loader from "@/components/Loader/loader";

export default function Loading() {
  return (
    <main className="min-h-[65vh] bg-pageBg" aria-label="Loading product">
      <Loader fullscreen={false} text="Preparing your fragrance..." />
    </main>
  );
}

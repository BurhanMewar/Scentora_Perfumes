import Loader from "@/components/Loader/loader";

export default function Loading() {
  return (
    <main className="min-h-[65vh] bg-pageBg" aria-label="Loading products">
      <Loader fullscreen={false} text="Finding your scent..." />
    </main>
  );
}

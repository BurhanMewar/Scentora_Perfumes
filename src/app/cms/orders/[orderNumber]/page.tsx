import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, X } from "lucide-react";
import OrderDetails from "@/components/storefront/cms/OrderDetails";
import OrderBackButton from "@/components/storefront/cms/OrderBackButton";
import { formatOrderDate, previewOrders } from "@/components/storefront/cms/orders-data";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = previewOrders.find((item) => item.orderNumber === decodeURIComponent(orderNumber));
  if (!order) notFound();

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-[#f7f0e2] text-[#211710]">
      <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#a15d2d]/20 bg-[radial-gradient(ellipse_at_88%_0%,rgba(252,140,61,0.14),transparent_38%),linear-gradient(105deg,#fffaf0,#f7ecd8)] shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-14 h-36 w-36 rounded-full border border-[#a15d2d]/10" />
        <div className="relative mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <OrderBackButton orderNumber={order.orderNumber} />
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a15d2d]">Order details</p>
            <h1 className="mt-0.5 truncate font-heading text-base font-semibold sm:text-lg">{order.orderNumber}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-[#75675a] sm:text-xs">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-semibold ${order.status === "Completed" ? "bg-emerald-100 text-emerald-800" : order.status === "Processing" ? "bg-[#fc8c3d]/15 text-[#8c4d24]" : "bg-stone-200 text-stone-700"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{order.status}</span>
              <span>Reference <b className="text-[#30251d]">{order.orderNumber.replace("SC-", "")}</b></span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#9a633e]"><CalendarDays className="h-3.5 w-3.5" />Order date</p>
            <p className="mt-0.5 font-heading text-sm font-semibold text-[#30251d] sm:text-base">{formatOrderDate(order.placedAt)}</p>
            <p className="mt-1 hidden items-center justify-end gap-1 text-[10px] text-[#75675a] sm:flex"><Clock3 className="h-3 w-3" />ETA: {order.status === "Completed" ? "Delivered" : "Pending"}</p>
          </div>
          <Link href="/cms?section=orders" aria-label="Close order details" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#a15d2d]/15 bg-white/70 text-[#8c4d24] transition hover:border-[#a15d2d]/35 hover:bg-[#fc8c3d]/15"><X className="h-4 w-4" /></Link>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-9 sm:px-5 sm:pb-4 sm:pt-11">
        <div className="mx-auto max-w-6xl">
          <OrderDetails order={order} />
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const RETURN_ORDER_KEY = "scentora.cms.orders.returnOrder";

export default function OrderBackButton({ orderNumber }: { orderNumber: string }) {
  return (
    <Link
      href="/cms?section=orders"
      aria-label="Back to order details popup"
      onClick={() => {
        window.sessionStorage.setItem(RETURN_ORDER_KEY, orderNumber);
        window.dispatchEvent(new CustomEvent("scentora:open-order", { detail: orderNumber }));
      }}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#a15d2d]/15 bg-white/70 text-[#8c4d24] shadow-sm transition hover:border-[#a15d2d]/35 hover:bg-[#fc8c3d]/15"
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}

import { CalendarDays, CreditCard, MapPin, PackageCheck, Truck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { formatOrderDate, type OrderRow } from "./orders-data";

export default function OrderDetails({ order }: { order: OrderRow }) {
  return (
    <div className="text-[#30251d]">
      <div className="grid gap-3 lg:grid-cols-12">
        <InfoPanel className="lg:col-span-6" title="Delivery details" icon={Truck}>
          <InfoItem label="Delivery status" value={order.status} />
          <InfoItem label="Delivery charges" value="Not provided" />
          <InfoItem label="Delivery distance" value="Not provided" />
        </InfoPanel>

        <InfoPanel className="lg:col-span-6" title="Recipient information" icon={MapPin}>
          <InfoItem label="Customer name" value={order.customer} />
          <InfoItem label="Phone number" value={order.phone} />
          <InfoItem label="Email address" value={order.email} />
          <InfoItem label="Delivery address" value={order.shippingAddress} wide />
        </InfoPanel>

        <InfoPanel className="lg:col-span-12" title="Order details" icon={CreditCard}>
          <InfoItem label="Reference" value={order.orderNumber.replace("SC-", "")} />
          <InfoItem label="Delivery date" value={formatOrderDate(order.placedAt)} icon={CalendarDays} />
          <InfoItem label="Payment status" value={order.payment} />
          <InfoItem label="Payment method" value="Not provided" />
          <InfoItem label="Schedule type" value="Standard delivery" />
          <InfoItem label="Items" value={String(order.items)} />
          <InfoItem label="Total amount" value={`${order.total.toFixed(3)} KWD`} highlight />
        </InfoPanel>

        <section className="flex h-full flex-col rounded-xl border border-[#a15d2d]/15 bg-[#fffdf8] p-3 sm:p-4 lg:col-span-12">
          <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#8c4d24] sm:text-xl"><PackageCheck className="h-5 w-5" /> Order items</div>
          <div className="grid flex-1 auto-rows-fr gap-2">
            {order.lines.map((line) => (
              <div key={`${line.sku}-${line.product}`} className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-[#a15d2d]/10 bg-white px-3 py-3 sm:px-4">
                <div className="min-w-0"><p className="truncate text-base font-semibold">{line.product}</p><p className="mt-1 text-xs text-[#796b5c]">SKU {line.sku} | Qty {line.quantity} x {line.unitPrice.toFixed(3)} KWD</p></div>
                <p className="shrink-0 text-sm font-bold text-[#8c4d24]">{(line.quantity * line.unitPrice).toFixed(3)} KWD</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoPanel({ title, icon: Icon, children, className = "" }: { title: string; icon: LucideIcon; children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[#a15d2d]/15 bg-[#fffdf8] p-3 sm:p-4 ${className}`}>
    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#8c4d24]"><Icon className="h-5 w-5" />{title}</h2>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">{children}</div>
  </section>;
}

function InfoItem({ label, value, wide = false, highlight = false, icon: Icon }: { label: string; value: string; wide?: boolean; highlight?: boolean; icon?: LucideIcon }) {
  return <div className={`min-w-0 ${wide ? "col-span-2" : ""}`}>
    <p className="flex items-center gap-1 text-[10px] font-semibold text-[#75675a]">{Icon ? <Icon className="h-3 w-3 text-[#a15d2d]" /> : null}{label}</p>
    <p className={`mt-0.5 break-words text-xs ${highlight ? "font-bold text-[#8c4d24]" : "text-[#4e4944]"}`}>{value}</p>
  </div>;
}

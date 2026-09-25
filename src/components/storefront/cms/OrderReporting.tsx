"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, Eye, PackageCheck, ReceiptText, WalletCards, X } from "lucide-react";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DynamicListing, { type ListingConfig } from "@/components/listing/DynamicListing";
import OrderDetails from "./OrderDetails";
import { formatOrderDate, previewOrders, type OrderRow } from "./orders-data";

const columns = [
  { key: "orderNumber", label: "Order", sortable: true, render: (value: string) => <span className="font-semibold text-[#7f451f]">{value}</span> },
  { key: "customer", label: "Customer", sortable: true, render: (_: unknown, row: OrderRow) => <div><p className="font-medium">{row.customer}</p><p className="text-xs text-gray-500">{row.email}</p></div> },
  { key: "placedAt", label: "Date", sortable: true },
  { key: "items", label: "Items", align: "center" as const },
  { key: "total", label: "Total (KWD)", align: "right" as const, sortable: true, render: (value: number) => <span className="font-semibold">{value.toFixed(3)}</span> },
  { key: "payment", label: "Payment", render: (value: OrderRow["payment"]) => <Chip size="small" label={value} color={value === "Paid" ? "success" : value === "Pending" ? "warning" : "default"} /> },
  { key: "status", label: "Order status", render: (value: OrderRow["status"]) => <Chip size="small" label={value} color={value === "Completed" ? "success" : value === "Processing" ? "info" : "default"} /> },
];

export default function OrderReporting() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  useEffect(() => {
    const openOrder = (orderNumber: string) => {
      setSelectedOrder(previewOrders.find((order) => order.orderNumber === orderNumber) ?? null);
    };
    const returnedOrderNumber = window.sessionStorage.getItem("scentora.cms.orders.returnOrder");
    window.sessionStorage.removeItem("scentora.cms.orders.returnOrder");
    if (returnedOrderNumber) openOrder(returnedOrderNumber);
    const handleReturn = (event: Event) => {
      window.sessionStorage.removeItem("scentora.cms.orders.returnOrder");
      openOrder((event as CustomEvent<string>).detail);
    };
    window.addEventListener("scentora:open-order", handleReturn);
    return () => window.removeEventListener("scentora:open-order", handleReturn);
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return previewOrders.filter((order) => {
      const matchesQuery = !normalizedQuery || [order.orderNumber, order.customer, order.email].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesPayment = !filters.payment || order.payment === filters.payment;
      const matchesStart = !filters.from || order.placedAt >= filters.from;
      const matchesEnd = !filters.to || order.placedAt <= filters.to;
      return matchesQuery && matchesStatus && matchesPayment && matchesStart && matchesEnd;
    });
  }, [filters, query]);

  const revenue = previewOrders.filter((order) => order.payment === "Paid").reduce((sum, order) => sum + order.total, 0);
  const paidCount = previewOrders.filter((order) => order.payment === "Paid").length;
  const pendingCount = previewOrders.filter((order) => order.payment === "Pending").length;

  const config: ListingConfig<OrderRow> = {
    title: "Order reporting",
    description: "Review order activity, payment status, and sales totals.",
    columns,
    searchable: true,
    searchPlaceholder: "Search order number or customer",
    filterable: true,
    showFilter: true,
    filterInSearch: true,
    fillAvailableHeight: true,
    compactStats: true,
    tableMinWidth: 1200,
    exportable: true,
    exportFileName: "scentora-order-report.csv",
    refreshable: false,
    filters: [
      { key: "status", label: "Order status", type: "select", options: [{ value: "Processing", label: "Processing" }, { value: "Completed", label: "Completed" }, { value: "Cancelled", label: "Cancelled" }] },
      { key: "payment", label: "Payment status", type: "select", options: [{ value: "Paid", label: "Paid" }, { value: "Pending", label: "Pending" }, { value: "Refunded", label: "Refunded" }] },
      { key: "from", label: "From date", type: "date" },
      { key: "to", label: "To date", type: "date" },
    ],
    stats: [
      { label: "Orders", value: previewOrders.length, color: "primary", icon: <ReceiptText className="h-5 w-5" /> },
      { label: "Paid revenue (KWD)", value: revenue.toFixed(3), color: "success", icon: <Banknote className="h-5 w-5" /> },
      { label: "Paid orders", value: paidCount, color: "success", icon: <PackageCheck className="h-5 w-5" /> },
      { label: "Payments pending", value: pendingCount, color: "warning", icon: <WalletCards className="h-5 w-5" /> },
    ],
    actions: [{
      key: "order-details",
      label: "View order details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (order) => setSelectedOrder(order),
    }],
    emptyState: { title: "No orders found", description: "Adjust the search or filters to see matching orders." },
  };

  return (
    <div className="cms-orders-report mx-auto flex h-full min-h-0 w-full min-w-0 max-w-7xl flex-col">
      <DynamicListing config={config} data={filteredOrders} onSearch={setQuery} onFilter={setFilters} />

      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, backgroundColor: "#fffdf8" } }}>
        {selectedOrder ? <>
          <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, borderBottom: "1px solid rgba(161,93,45,0.15)", background: "radial-gradient(ellipse at 88% 0%, rgba(252,140,61,0.13), transparent 40%), linear-gradient(105deg, #fffaf0, #f7ecd8)", color: "#211710", pr: 1.5 }}>
            <div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a15d2d]">Order details</p><p className="mt-0.5 text-base font-semibold">{selectedOrder.orderNumber}</p><span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${selectedOrder.status === "Completed" ? "bg-emerald-100 text-emerald-800" : selectedOrder.status === "Processing" ? "bg-[#fc8c3d]/15 text-[#8c4d24]" : "bg-stone-200 text-stone-700"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{selectedOrder.status}</span></div>
            <div className="shrink-0 text-right"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9a633e]">Order date</p><p className="mt-0.5 font-heading text-sm font-semibold text-[#30251d] sm:text-base">{formatOrderDate(selectedOrder.placedAt)}</p></div>
            <IconButton aria-label="Close order details" onClick={() => setSelectedOrder(null)} sx={{ color: "#8c4d24", border: "1px solid rgba(161,93,45,0.15)", backgroundColor: "rgba(255,255,255,0.65)" }}><X className="h-4 w-4" /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}>
            <div className="mt-4 sm:mt-5">
              <OrderDetails order={selectedOrder} />
            </div>
            <Link href={`/cms/orders/${encodeURIComponent(selectedOrder.orderNumber)}`} onClick={() => setSelectedOrder(null)} className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[#211710] px-4 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#3a281b]">Open full order page</Link>
          </DialogContent>
        </> : null}
      </Dialog>
    </div>
  );
}

export type OrderLine = {
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
};

export type OrderRow = {
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  shippingAddress: string;
  placedAt: string;
  items: number;
  total: number;
  payment: "Paid" | "Pending" | "Refunded";
  status: "Completed" | "Processing" | "Cancelled";
  lines: OrderLine[];
};

export function formatOrderDate(date: string) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

// Preview records keep the reporting UI usable until the order API is available.
export const previewOrders: OrderRow[] = [
  { orderNumber: "SC-1048", customer: "Mariam Al-Sabah", email: "mariam@example.com", phone: "+965 5550 1048", shippingAddress: "Salmiya, Kuwait City, Kuwait", placedAt: "2026-09-24", items: 2, total: 245, payment: "Paid", status: "Completed", lines: [{ product: "Noir Mystique", sku: "SC-NM-100", quantity: 1, unitPrice: 120 }, { product: "Amber Dusk", sku: "SC-AD-210", quantity: 1, unitPrice: 125 }] },
  { orderNumber: "SC-1047", customer: "Yousef Khalid", email: "yousef@example.com", phone: "+965 5550 1047", shippingAddress: "Hawalli, Kuwait City, Kuwait", placedAt: "2026-09-23", items: 1, total: 120, payment: "Paid", status: "Processing", lines: [{ product: "Noir Mystique", sku: "SC-NM-100", quantity: 1, unitPrice: 120 }] },
  { orderNumber: "SC-1046", customer: "Noor Al-Ali", email: "noor@example.com", phone: "+965 5550 1046", shippingAddress: "Jabriya, Kuwait City, Kuwait", placedAt: "2026-09-23", items: 3, total: 370, payment: "Pending", status: "Processing", lines: [{ product: "Velvet Bloom", sku: "SC-VB-120", quantity: 2, unitPrice: 135 }, { product: "Cedar Amber", sku: "SC-CA-310", quantity: 1, unitPrice: 100 }] },
  { orderNumber: "SC-1045", customer: "Dana Hassan", email: "dana@example.com", phone: "+965 5550 1045", shippingAddress: "Kuwait City, Kuwait", placedAt: "2026-09-22", items: 1, total: 135, payment: "Paid", status: "Completed", lines: [{ product: "Velvet Bloom", sku: "SC-VB-120", quantity: 1, unitPrice: 135 }] },
  { orderNumber: "SC-1044", customer: "Salem Nasser", email: "salem@example.com", phone: "+965 5550 1044", shippingAddress: "Fintas, Ahmadi, Kuwait", placedAt: "2026-09-21", items: 2, total: 220, payment: "Refunded", status: "Cancelled", lines: [{ product: "Cedar Amber", sku: "SC-CA-310", quantity: 2, unitPrice: 110 }] },
  { orderNumber: "SC-1043", customer: "Laila Omar", email: "laila@example.com", phone: "+965 5550 1043", shippingAddress: "Farwaniya, Kuwait", placedAt: "2026-09-20", items: 1, total: 110, payment: "Paid", status: "Completed", lines: [{ product: "Cedar Amber", sku: "SC-CA-310", quantity: 1, unitPrice: 110 }] },
  { orderNumber: "SC-1042", customer: "Hamad Faisal", email: "hamad@example.com", phone: "+965 5550 1042", shippingAddress: "Mubarak Al-Kabeer, Kuwait", placedAt: "2026-09-19", items: 2, total: 255, payment: "Pending", status: "Processing", lines: [{ product: "Amber Dusk", sku: "SC-AD-210", quantity: 1, unitPrice: 125 }, { product: "Velvet Bloom", sku: "SC-VB-120", quantity: 1, unitPrice: 130 }] },
];

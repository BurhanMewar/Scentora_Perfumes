import type { Metadata } from "next";
import AccountPanel from "@/components/storefront/account/AccountPanel";

export const metadata: Metadata = {
  title: "Your Account | Scentora",
  description: "Create a Scentora account or view your customer details.",
};

export default function AccountPage() {
  return <AccountPanel />;
}


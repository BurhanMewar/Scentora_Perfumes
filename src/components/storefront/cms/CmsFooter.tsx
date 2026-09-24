import Link from "next/link";

export default function CmsFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#fef8e8] px-5 py-6 text-xs text-textSecondary sm:px-8 lg:px-12">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Scentora Content Studio</p>
        {/* <div className="flex gap-4">
          <Link href="/" className="hover:text-textPrimary">Storefront</Link>
          <span>API-ready workspace</span>
        </div> */}
      </div>
    </footer>
  );
}

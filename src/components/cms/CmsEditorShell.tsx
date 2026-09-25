import { Save, Upload } from "lucide-react";
import type { ReactNode } from "react";

export default function CmsEditorShell({
  title,
  description,
  children,
  headerAction,
  onSave,
  onPublish,
}: {
  title: string;
  description: string;
  children: ReactNode;
  headerAction?: ReactNode;
  onSave: () => void;
  onPublish?: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSecondary">Content editor</p>
          <h3 className="mt-2 font-heading text-3xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-textSecondary">{description}</p>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          {headerAction}
          <button type="button" onClick={onSave} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-3 text-xs font-semibold text-textPrimary hover:bg-black/5 sm:flex-none sm:px-4 sm:text-sm">
            <Save className="h-4 w-4" /> Save draft
          </button>
          {onPublish ? (
            <button type="button" onClick={onPublish} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-black px-3 text-xs font-semibold text-white hover:bg-black/80 sm:flex-none sm:px-4 sm:text-sm">
              <Upload className="h-4 w-4" /> Publish
            </button>
          ) : null}
        </div>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card sm:p-7">{children}</div>
    </div>
  );
}


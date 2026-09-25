"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CmsEditorShell from "@/components/storefront/cms/CmsEditorShell";
import DynamicListing, { type ListingConfig } from "@/components/listing/DynamicListing";
import ConfirmationDialog from "@/components/notifications/ConfirmationDialog";
import { ErrorNotification, SuccessNotification } from "@/components/notifications";
import { CreateRoleModal } from "@/app/role/CreateRole";
import { RoleDetailModal } from "@/app/role/ViewEditRole";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteRole,
  fetchRoleById,
  fetchRoles,
  selectRoleError,
  selectRoles,
  type Role,
} from "@/slice/RoleSlice";

type Notice = { open: boolean; title: string; message: string };

export default function RolesEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const loading = useAppSelector((state) => state.role.isListingLoading);
  const error = useAppSelector(selectRoleError);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState<Notice>({ open: false, title: "", message: "" });
  const [failure, setFailure] = useState<Notice>({ open: false, title: "", message: "" });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  function showSuccess(message: string) {
    setSuccess({ open: true, title: "Success", message });
    dispatch(fetchRoles());
  }

  function showFailure(message: string) {
    setFailure({ open: true, title: "Unable to complete action", message });
  }

  async function startEdit(role: Role) {
    try {
      await dispatch(fetchRoleById(String(role.id))).unwrap();
      setEditingRole(role);
    } catch (reason) {
      showFailure(String(reason || "Could not load role details."));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const role = deleteTarget;
      await dispatch(deleteRole(String(role.id))).unwrap();
      setDeleteTarget(null);
      showSuccess(`Role “${role.rolename}” was deleted.`);
    } catch (reason) {
      showFailure(String(reason || "Could not delete this role."));
    } finally {
      setDeleteLoading(false);
    }
  }

  const config: ListingConfig<Role> = {
    title: "Roles",
    hideHeader: true,
    searchable: true,
    searchPlaceholder: "Search roles",
    tableMinWidth: 620,
    columns: [
      { key: "rolename", label: "Role name", sortable: true, render: (value) => <span className="font-semibold">{value || "—"}</span> },
      { key: "status", label: "Status", render: (value) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${Number(value) === 1 ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{Number(value) === 1 ? "Active" : "Inactive"}</span> },
      { key: "createdDate", label: "Created date", sortable: true, render: (value) => value ? new Date(value).toLocaleDateString() : "—" },
    ],
    actions: [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: startEdit },
      { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, color: "error", onClick: setDeleteTarget },
    ],
    emptyState: {
      title: "No roles found",
      description: "Create a role to control CMS access and permissions.",
      action: { label: "Add role", onClick: () => setCreateOpen(true) },
    },
  };

  return (
    <CmsEditorShell
      title="Role management"
      description="Create and manage the roles that control CMS access."
      onSave={onSave}
      onPublish={onPublish}
      headerAction={<button type="button" onClick={() => setCreateOpen(true)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#a15d2d] px-3 text-xs font-semibold text-white hover:bg-[#8c4d24] sm:flex-none sm:px-4 sm:text-sm"><Plus className="h-4 w-4" /> Add role</button>}
    >
      <DynamicListing config={config} data={roles} loading={loading} error={error} />
      <CreateRoleModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={(message) => { setCreateOpen(false); showSuccess(message); }} OnFailure={showFailure} />
      <RoleDetailModal open={Boolean(editingRole)} onClose={() => setEditingRole(null)} role={editingRole} mode="edit" onSuccess={(message) => { setEditingRole(null); showSuccess(message); }} OnFailure={showFailure} />
      <ConfirmationDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} title="Delete role?" message={`Delete the role “${deleteTarget?.rolename ?? ""}”? This action cannot be undone.`} confirmText="Delete role" cancelText="Keep role" type="danger" loading={deleteLoading} />
      <SuccessNotification open={success.open} onClose={() => setSuccess((current) => ({ ...current, open: false }))} title={success.title} message={success.message} />
      <ErrorNotification open={failure.open} onClose={() => setFailure((current) => ({ ...current, open: false }))} title={failure.title} message={failure.message} />
    </CmsEditorShell>
  );
}

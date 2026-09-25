"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DynamicButton from "@/components/DynamicButton";

export type CmsDialogField = {
  key: string;
  label: string;
  value: string;
  type?: "text" | "number" | "textarea" | "select";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

export default function CmsEntityDialog({
  open,
  title,
  description,
  fields,
  onChange,
  onClose,
  onSave,
  saveLabel = "Save changes",
}: {
  open: boolean;
  title: string;
  description: string;
  fields: CmsDialogField[];
  onChange: (key: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { overflow: "hidden", border: "1px solid rgba(161,93,45,0.2)", borderRadius: 3, backgroundColor: "#fffaf0", color: "#211710", boxShadow: "0 18px 40px rgba(33,23,16,0.2)" } }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid rgba(161,93,45,0.16)", background: "linear-gradient(105deg,#fffaf0,#f7ecd8)", px: 3, py: 2 }}>
        <span className="block font-heading text-lg font-semibold text-[#30251d]">{title}</span>
        <span className="mt-1 block text-sm font-normal text-[#796b5c]">{description}</span>
      </DialogTitle>
      <DialogContent sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: fields.length > 2 ? "repeat(2,minmax(0,1fr))" : "1fr" }, gap: 2, px: 3, pt: "36px !important", pb: 3 }}>
        {fields.map((field) => (
          <TextField
            key={field.key}
            fullWidth
            size="small"
            label={field.label}
            type={field.type === "number" ? "number" : "text"}
            required={field.required}
            multiline={field.type === "textarea"}
            minRows={field.type === "textarea" ? 3 : undefined}
            select={field.type === "select"}
            value={field.value}
            onChange={(event) => onChange(field.key, event.target.value)}
            sx={{ gridColumn: field.type === "textarea" ? "1 / -1" : undefined, "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "#fffdf8", "& fieldset": { borderColor: "rgba(161,93,45,0.24)" }, "&:hover fieldset": { borderColor: "#a15d2d" }, "&.Mui-focused fieldset": { borderColor: "#a15d2d" } }, "& .MuiInputLabel-root.Mui-focused": { color: "#8c4d24" } }}
          >
            {field.type === "select" ? field.options?.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>) : undefined}
          </TextField>
        ))}
      </DialogContent>
      <DialogActions sx={{ gap: 1, borderTop: "1px solid rgba(161,93,45,0.14)", backgroundColor: "#fffdf8", px: 3, py: 2 }}>
        <DynamicButton variant="outlined" size="small" onClick={onClose} sx={{ minHeight: 40, minWidth: 96, borderRadius: 2, borderColor: "rgba(161,93,45,0.35)", color: "#8c4d24", "&:hover": { borderColor: "#a15d2d", backgroundColor: "#fcf2e6" } }}>Cancel</DynamicButton>
        <DynamicButton variant="primary" size="small" onClick={onSave} sx={{ minHeight: 40, minWidth: 120, borderRadius: 2, backgroundColor: "#211710", color: "#fffaf0", "&:hover": { backgroundColor: "#8c4d24" } }}>{saveLabel}</DynamicButton>
      </DialogActions>
    </Dialog>
  );
}


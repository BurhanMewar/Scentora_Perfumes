// Common constants for the application
export const STATUS_OPTIONS = {
  New: 1,
  Draft: 2,
  Unpublished: 3,
  Published: 4,
} as const;

export type StatusOption = keyof typeof STATUS_OPTIONS;
export type StatusValue = typeof STATUS_OPTIONS[StatusOption];

// Helper function to get status options for dropdowns
export const getStatusOptions = () => {
  return Object.entries(STATUS_OPTIONS).map(([label, value]) => ({
    label,
    value,
  }));
};

// Helper function to get status label by value
export const getStatusLabel = (value: StatusValue): StatusOption => {
  const entry = Object.entries(STATUS_OPTIONS).find(([, val]) => val === value);
  return entry ? (entry[0] as StatusOption) : 'New';
};

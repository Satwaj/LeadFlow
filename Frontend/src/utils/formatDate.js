export const formatDate = (value, options = {}) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
};

export const formatDateTime = (value) =>
  formatDate(value, {
    hour: "2-digit",
    minute: "2-digit",
  });

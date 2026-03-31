// TypeScript types
type DateInput = {
  year?: unknown;
  month?: unknown;
  day?: unknown;
};

// Format the date from an object shape to a string with the format YYYY-MM-DD
export function formatDate(date?: DateInput): string {
  if (!date) return "";
  const year = String(date.year);
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

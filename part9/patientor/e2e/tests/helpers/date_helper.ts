type DateInput = {
  year?: unknown;
  month?: unknown;
  day?: unknown;
};

export function formatDate(date?: DateInput): string {
  if (date) return `${date.year}-${date.month}-${date.day}`;
  else return "";
}

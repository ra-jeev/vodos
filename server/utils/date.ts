export function getDate(dateString?: string): Date | undefined {
  if (!dateString) {
    return;
  }

  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
}

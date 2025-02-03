export function formatDate(date: Date, locales: string | string[] | readonly string[]) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  };
  return date.toLocaleDateString(locales, options);
}

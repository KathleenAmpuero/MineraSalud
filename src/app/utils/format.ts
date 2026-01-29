export function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    localeMatcher: 'best fit',
  };
  return new Date(date).toLocaleDateString('es-CL', options);
}

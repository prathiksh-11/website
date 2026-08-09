import dayjs from 'dayjs';

export const formatDate = (value?: string | null, pattern = 'DD MMM YYYY') => {
  if (!value) return '—';
  return dayjs(value).format(pattern);
};

export const formatDateTime = (value?: string | null) =>
  formatDate(value, 'DD MMM YYYY, hh:mm A');

export const formatCurrency = (value: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const downloadBlob = (
  content: Blob | ArrayBuffer | string,
  filename: string,
  type?: string,
) => {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: type ?? 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const cell = String(row[h] ?? '');
          return `"${cell.replace(/"/g, '""')}"`;
        })
        .join(','),
    ),
  ];
  return lines.join('\n');
};

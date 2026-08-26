import dayjs from 'dayjs';

export const formatDate = (value?: string | null, pattern = 'DD MMM YYYY') => {
  if (!value) return '—';
  return dayjs(value).format(pattern);
};

export const formatDateTime = (value?: string | null) =>
  formatDate(value, 'DD MMM YYYY, hh:mm A');

export const formatCurrency = (
  value?: number | string | null,
  currency = 'INR',
) => {
  if (value == null || value === '') return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatCompactCurrency = (value?: number | null) => {
  if (value == null || value === 0) return '₹0';
  const abs = Math.abs(value);
  if (abs >= 10_000_000) {
    const formatted = (value / 10_000_000).toFixed(abs >= 100_000_000 ? 0 : 1).replace(/\.0$/, '');
    return `₹${formatted}Cr`;
  }
  if (abs >= 100_000) {
    const formatted = (value / 100_000).toFixed(abs >= 1_000_000 ? 0 : 1).replace(/\.0$/, '');
    return `₹${formatted}L`;
  }
  if (abs >= 1_000) {
    const formatted = (value / 1_000).toFixed(abs >= 10_000 ? 0 : 1).replace(/\.0$/, '');
    return `₹${formatted}k`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

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

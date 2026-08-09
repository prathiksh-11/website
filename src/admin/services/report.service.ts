import { reportApi } from '@/api/report.api';
import type { ReportQuery } from '@/types';

export const reportService = {
  fetch: (query: ReportQuery) => reportApi.fetch(query),
  downloadExcel: (query: ReportQuery) => reportApi.downloadExcel(query),
  downloadPdf: (query: ReportQuery) => reportApi.downloadPdf(query),
};

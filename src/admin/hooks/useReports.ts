import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { reportService } from '@/services/report.service';
import type { ReportExportType, ReportQuery } from '@/types';

export const useGymReport = (query: ReportQuery, enabled = true) =>
  useQuery({
    queryKey: ['reports', 'gym', query],
    queryFn: () => reportService.fetch(query),
    enabled:
      enabled &&
      (query.filter !== 'custom' || Boolean(query.startDate && query.endDate)),
    staleTime: 30_000,
  });

export const useReportExport = (query: ReportQuery) => {
  const excel = useMutation({
    mutationFn: (reportType: ReportExportType) =>
      reportService.downloadExcel({ ...query, reportType }),
    onSuccess: (_data, reportType) => {
      const label =
        reportType === 'attendance'
          ? 'Trainer attendance'
          : reportType === 'branch'
            ? 'Branch summary'
            : 'Report';
      message.success(`${label} Excel download started`);
    },
    onError: (error: { message?: string }) =>
      message.error(error.message ?? 'Excel export failed'),
  });

  const pdf = useMutation({
    mutationFn: () => reportService.downloadPdf(query),
    onSuccess: () => message.success('PDF download started'),
    onError: (error: { message?: string }) =>
      message.error(error.message ?? 'PDF export failed'),
  });

  return { excel, pdf };
};

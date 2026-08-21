import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
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

/** Fetch multiple gym report date ranges in parallel (week/month revenue slices). */
export const useGymReportQueries = (queries: ReportQuery[], enabled = true) =>
  useQueries({
    queries: queries.map((query) => ({
      queryKey: ['reports', 'gym', query] as const,
      queryFn: () => reportService.fetch(query),
      enabled:
        enabled &&
        query.filter === 'custom' &&
        Boolean(query.startDate && query.endDate),
      staleTime: 30_000,
    })),
  });

export const useReportExport = (query: ReportQuery) => {
  const excel = useMutation({
    mutationFn: (
      args:
        | ReportExportType
        | {
            reportType: ReportExportType;
            branchId?: string;
            filter?: ReportQuery['filter'];
            startDate?: string;
            endDate?: string;
          },
    ) => {
      if (typeof args === 'string') {
        return reportService.downloadExcel({ ...query, reportType: args });
      }
      return reportService.downloadExcel({
        ...query,
        reportType: args.reportType,
        branchId: args.branchId ?? query.branchId,
        filter: args.filter ?? query.filter,
        startDate: args.startDate,
        endDate: args.endDate,
        trainerId: undefined,
      });
    },
    onSuccess: (_data, args) => {
      const reportType = typeof args === 'string' ? args : args.reportType;
      const label =
        reportType === 'attendance'
          ? 'Trainer attendance'
          : reportType === 'branch'
            ? 'Branch summary'
            : reportType === 'pending'
              ? 'Pending amount'
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

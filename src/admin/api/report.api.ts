import { USE_MOCK } from '@/constants';
import { delay, MOCK_BRANCHES, MOCK_TRAINERS } from '@/mocks/data';
import type { GymReport, ReportQuery } from '@/types';
import { downloadBlob } from '@/utils/format';
import { emptyGymReport, mapBackendGymReport } from '@/utils/report-map';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

const toBody = (query: ReportQuery) => {
  const body: Record<string, unknown> = {
    filter: query.filter || 'monthly',
  };

  if (query.filter === 'custom') {
    body.start_date = query.startDate;
    body.end_date = query.endDate;
  }

  if (query.branchId != null && query.branchId !== '') {
    body.branch_id = Array.isArray(query.branchId)
      ? query.branchId.map(Number)
      : Number(query.branchId);
  }

  if (query.trainerId != null && query.trainerId !== '') {
    body.trainer_id = Array.isArray(query.trainerId)
      ? query.trainerId.map(Number)
      : Number(query.trainerId);
  }

  return body;
};

const buildMockReport = (query: ReportQuery): GymReport => {
  const branches = MOCK_BRANCHES.filter((b) =>
    query.branchId ? b.id === query.branchId : true,
  ).map((b, index) => {
    const trainers = MOCK_TRAINERS.filter((t) => t.branchId === b.id).map(
      (t, i) => ({
        id: t.id,
        name: t.name,
        mobile: t.phone,
        image: t.avatar,
        ptClients: 8 + i * 2,
        sessionsPurchased: 40 + i * 6,
        sessionsCompleted: 28 + i * 4,
        sessionsDisplay: `${28 + i * 4}/${40 + i * 6}`,
        completionPercentage: 70 + i,
        totalRevenue: 45000 + i * 8000,
        utilizedRevenue: 32000 + i * 5000,
        revenueUtilization: 68 + i,
        attendance: {
          presentDays: 18 + i,
          totalDays: 22,
          attendanceDisplay: `${18 + i}/22`,
          attendancePercentage: 80 + i,
        },
        workingHours: `0${6 + i}:30`,
        branchId: b.id,
        branchName: b.name,
      }),
    );

    const subscriberRevenue = 180000 - index * 22000;
    const ptRevenue = 95000 - index * 9000;
    const eventRevenue = 18000 - index * 2000;

    return {
      id: b.id,
      name: b.name,
      summary: {
        totalCustomers: 48 + index * 8,
        subscriberClients: 40 + index * 6,
        subscriberRevenue,
        ptClients: 12 + index * 2,
        ptRevenue,
        eventClients: 6 + index,
        eventRevenue,
        totalRevenue: subscriberRevenue + ptRevenue + eventRevenue,
      },
      highlights: {
        activeTrainers: trainers.length || b.trainerCount,
        sessionsPurchased: trainers.reduce((s, t) => s + t.sessionsPurchased, 0),
        sessionsCompleted: trainers.reduce((s, t) => s + t.sessionsCompleted, 0),
        sessionsRemaining: trainers.reduce(
          (s, t) => s + (t.sessionsPurchased - t.sessionsCompleted),
          0,
        ),
        sessionUtilization: 72 + index,
      },
      trainers,
    };
  });

  const mapped = mapBackendGymReport({
    branch_ids: branches.map((b) => b.id),
    branches: branches.map((b) => ({
      branch_id: b.id,
      branch_name: b.name,
      summary: {
        total_customers: b.summary.totalCustomers,
        subscriber_clients: b.summary.subscriberClients,
        subscriber_revenue: b.summary.subscriberRevenue,
        pt_clients: b.summary.ptClients,
        pt_revenue: b.summary.ptRevenue,
        event_clients: b.summary.eventClients,
        event_revenue: b.summary.eventRevenue,
        total_revenue: b.summary.totalRevenue,
      },
      highlights: {
        active_trainers: b.highlights.activeTrainers,
        total_sessions_purchased: b.highlights.sessionsPurchased,
        total_sessions_completed: b.highlights.sessionsCompleted,
        total_sessions_remaining: b.highlights.sessionsRemaining,
        session_utilization_percentage: b.highlights.sessionUtilization,
      },
      trainers: b.trainers.map((t) => ({
        trainer_id: t.id,
        trainer_name: t.name,
        trainer_mobile: t.mobile,
        trainer_image: t.image,
        total_pt_clients: t.ptClients,
        sessions_purchased: t.sessionsPurchased,
        sessions_completed: t.sessionsCompleted,
        sessions_display: t.sessionsDisplay,
        session_completion_percentage: t.completionPercentage,
        total_revenue: t.totalRevenue,
        utilized_revenue: t.utilizedRevenue,
        revenue_utilization_percentage: t.revenueUtilization,
        attendance: {
          present_days: t.attendance.presentDays,
          total_days: t.attendance.totalDays,
          attendance_display: t.attendance.attendanceDisplay,
          attendance_percentage: t.attendance.attendancePercentage,
        },
        total_working_hours: t.workingHours,
      })),
    })),
  });

  return mapped;
};

export const reportApi = {
  fetch: async (query: ReportQuery): Promise<GymReport> => {
    if (USE_MOCK) {
      await delay();
      return buildMockReport(query);
    }

    const { data } = await apiClient.post<{
      success?: boolean;
      data?: Record<string, unknown>;
      message?: string;
    }>(ENDPOINTS.REPORTS.ROOT, toBody(query));

    if (!data?.data || typeof data.data !== 'object') {
      return emptyGymReport();
    }

    return mapBackendGymReport(data.data);
  },

  downloadExcel: async (query: ReportQuery): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      downloadBlob('mock-report', `Gym_Report_${Date.now()}.txt`, 'text/plain');
      return;
    }

    const { data } = await apiClient.post<Blob>(
      ENDPOINTS.REPORTS.DOWNLOAD,
      toBody(query),
      { responseType: 'blob', timeout: 120_000 },
    );
    downloadBlob(
      data,
      `Gym_Report_${Date.now()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  },

  downloadPdf: async (query: ReportQuery): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      downloadBlob('mock-report', `Gym_Report_${Date.now()}.txt`, 'text/plain');
      return;
    }

    const { data } = await apiClient.post<Blob>(
      ENDPOINTS.REPORTS.DOWNLOAD_PDF,
      toBody(query),
      { responseType: 'blob', timeout: 120_000 },
    );
    downloadBlob(data, `Gym_Report_${Date.now()}.pdf`, 'application/pdf');
  },
};

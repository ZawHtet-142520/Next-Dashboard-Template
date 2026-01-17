import { readClient } from "@/api/readClient";

export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  status: number;
  data: DashboardStats;
}

export const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await readClient.get("/v1/dashboard/stats");
  return response.data;
};

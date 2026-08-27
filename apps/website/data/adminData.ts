export interface AdminGameItem {
  id: string;
  slug: string;
  title: string;
  genre: string;
  status: string;
  releaseYear: string;
  platforms: string[];
  totalPlayers: string;
  revenue: string;
  updatedAt: string;
}

export const adminGamesList: AdminGameItem[] = [];
export const adminDispatchesList: any[] = [];
export const adminUsersList: any[] = [];
export const adminAuditLogs: any[] = [];

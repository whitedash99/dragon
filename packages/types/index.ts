export type ContactStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'SPAM';
export type ContactPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  priority: ContactPriority;
  attachments?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ContactReplyPayload {
  contactId: string;
  toEmail: string;
  subject: string;
  message: string;
  senderName?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  userId?: string;
  userEmail?: string;
  details?: Record<string, any>;
  timestamp: Date | string;
}

export interface SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  uptimeSeconds: number;
  databaseConnected: boolean;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

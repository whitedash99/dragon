import { z } from 'zod';
export { z };

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const ContactReplySchema = z.object({
  contactId: z.string().min(1, 'Contact ID is required'),
  toEmail: z.string().email('Valid recipient email required'),
  subject: z.string().min(1, 'Subject line required'),
  message: z.string().min(1, 'Reply message cannot be empty'),
});

export type ContactReplyData = z.infer<typeof ContactReplySchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// ══════════════════════════════════════════════════════════════════
// 🐉 DRAGON STUDIOS COMMUNITY & REAL-TIME CHAT ZOD SCHEMAS
// ══════════════════════════════════════════════════════════════════

export const SendMessageSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
  replyToId: z.string().optional().nullable(),
  attachments: z.array(z.string().url()).optional().default([]),
});

export type SendMessageData = z.infer<typeof SendMessageSchema>;

export const ToggleReactionSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),
  emoji: z.string().min(1).max(16, 'Emoji must be valid symbol'),
});

export type ToggleReactionData = z.infer<typeof ToggleReactionSchema>;

export const CreateRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters').max(50, 'Room name too long'),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric and dashes'),
  description: z.string().max(250).optional(),
  category: z.enum(['INFORMATION', 'COMMUNITY', 'GAMES', 'OFF_TOPIC']).default('COMMUNITY'),
  type: z.enum(['TEXT', 'ANNOUNCEMENT', 'GAME_LOUNGE', 'VOICE']).default('TEXT'),
  gameId: z.string().optional().nullable(),
  isPublic: z.boolean().default(true),
  order: z.number().int().default(0),
});

export type CreateRoomData = z.infer<typeof CreateRoomSchema>;

export const CreateThreadSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  title: z.string().min(4, 'Title must be at least 4 characters').max(150, 'Title cannot exceed 150 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000, 'Content cannot exceed 10,000 characters'),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateThreadData = z.infer<typeof CreateThreadSchema>;

export const CreatePostSchema = z.object({
  threadId: z.string().min(1, 'Thread ID is required'),
  content: z.string().min(2, 'Post cannot be empty').max(5000, 'Post cannot exceed 5000 characters'),
});

export type CreatePostData = z.infer<typeof CreatePostSchema>;

export const CreateReportSchema = z.object({
  targetType: z.enum(['MESSAGE', 'THREAD', 'POST', 'USER']),
  messageId: z.string().optional().nullable(),
  threadId: z.string().optional().nullable(),
  postId: z.string().optional().nullable(),
  reportedUserId: z.string().optional().nullable(),
  reason: z.enum(['SPAM', 'HARASSMENT', 'INAPPROPRIATE', 'SCAM', 'IMPERSONATION', 'OTHER']),
  details: z.string().max(1000).optional(),
});

export type CreateReportData = z.infer<typeof CreateReportSchema>;

export const ModerationActionSchema = z.object({
  targetUserId: z.string().min(1, 'Target user ID is required'),
  action: z.enum(['WARN', 'MUTE', 'KICK', 'BAN', 'UNBAN', 'UNMUTE', 'DELETE_CONTENT']),
  reason: z.string().min(3, 'Reason is required').max(500),
  durationMinutes: z.number().int().positive().optional().nullable(),
  contentId: z.string().optional().nullable(),
  contentType: z.enum(['MESSAGE', 'THREAD', 'POST']).optional().nullable(),
});

export type ModerationActionData = z.infer<typeof ModerationActionSchema>;

// ══════════════════════════════════════════════════════════════════
// 🎮 DRAGON STUDIOS GAME DISTRIBUTION & BACKBLAZE B2 ZOD SCHEMAS
// ══════════════════════════════════════════════════════════════════

export const CreateGameReleaseSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  version: z.string().min(1, 'Version is required').regex(/^[vV]?[0-9]+\.[0-9]+(\.[0-9]+)?(-[a-zA-Z0-9.]+)?$/, 'Invalid version format (e.g. v1.0.0 or 1.0.0)'),
  buildNumber: z.number().int().positive().default(1),
  platform: z.enum(['WINDOWS', 'ANDROID']),
  targetArch: z.string().optional().default('x64'),
  fileType: z.enum(['EXE', 'ZIP', 'INSTALLER', 'APK', 'AAB']),
  fileName: z.string().min(1, 'File name is required').regex(/^[a-zA-Z0-9._-]+$/, 'Filename contains invalid characters'),
  fileSizeBytes: z.number().int().positive('File size must be greater than 0 bytes'),
  sha256Checksum: z.string().regex(/^[a-fA-F0-9]{64}$/, 'SHA-256 checksum must be a 64-character hexadecimal hash'),
  releaseNotes: z.string().max(10000).optional(),
});

export type CreateGameReleaseData = z.infer<typeof CreateGameReleaseSchema>;

export const InitUploadSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  releaseId: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  platform: z.enum(['WINDOWS', 'ANDROID']),
  fileName: z.string().min(1, 'File name is required'),
  fileSizeBytes: z.number().int().positive('File size must be positive').max(100 * 1024 * 1024 * 1024, 'File exceeds maximum 100GB limit'),
  sha256Checksum: z.string().regex(/^[a-fA-F0-9]{64}$/, 'SHA-256 checksum must be a 64-character hexadecimal hash'),
  contentType: z.string().optional().default('application/octet-stream'),
});

export type InitUploadData = z.infer<typeof InitUploadSchema>;

export const VerifyUploadSchema = z.object({
  releaseId: z.string().min(1, 'Release ID is required'),
  fileSizeBytes: z.number().int().positive().optional(),
  sha256Checksum: z.string().regex(/^[a-fA-F0-9]{64}$/).optional(),
});

export type VerifyUploadData = z.infer<typeof VerifyUploadSchema>;

export const PublishReleaseSchema = z.object({
  releaseId: z.string().min(1, 'Release ID is required'),
  action: z.enum(['PUBLISH', 'UNPUBLISH', 'DEPRECATE', 'ARCHIVE']),
});

export type PublishReleaseData = z.infer<typeof PublishReleaseSchema>;

export const DownloadGameQuerySchema = z.object({
  platform: z.enum(['windows', 'android', 'WINDOWS', 'ANDROID']).default('windows'),
});

export type DownloadGameQueryData = z.infer<typeof DownloadGameQuerySchema>;


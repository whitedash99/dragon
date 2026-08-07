import { z } from 'zod';

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

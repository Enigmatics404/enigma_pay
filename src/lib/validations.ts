import { z } from 'zod';

/**
 * Form validation schemas using Zod for robust type-safe validation.
 */

/**
 * Schema for employee form validation
 */
export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  walletAddress: z
    .string()
    .min(42, 'Wallet address must be a valid Ethereum address (42 characters)')
    .max(42, 'Wallet address must be a valid Ethereum address (42 characters)')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address starting with 0x'),
  
  salary: z
    .number()
    .positive('Salary must be a positive number')
    .max(1000000000, 'Salary seems too high'),
  
  tokenType: z
    .string()
    .min(1, 'Token type is required')
    .max(20, 'Token type must be less than 20 characters'),
  
  department: z
    .string()
    .min(1, 'Department is required')
    .max(50, 'Department must be less than 50 characters'),
  
  role: z
    .string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters'),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

/**
 * Schema for login/authentication validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address')
    .optional(),
}).refine(data => data.email || data.walletAddress, {
  message: 'Either email or wallet address is required',
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema for batch payment validation
 */
export const batchPaySchema = z.object({
  recipients: z
    .array(z.string())
    .min(1, 'At least one recipient is required')
    .max(100, 'Maximum 100 recipients per batch'),
  totalAmount: z
    .number()
    .positive('Total amount must be positive')
    .max(10000000, 'Amount exceeds maximum limit'),
  network: z
    .string()
    .min(1, 'Network selection is required'),
  memo: z
    .string()
    .max(500, 'Memo must be less than 500 characters')
    .optional(),
});

export type BatchPayFormData = z.infer<typeof batchPaySchema>;

/**
 * Schema for automation/schedule configuration
 */
export const automationSchema = z.object({
  isEnabled: z.boolean(),
  frequency: z.enum(['weekly', 'monthly']),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  tokenType: z.string().min(1, 'Token type is required'),
});

export type AutomationFormData = z.infer<typeof automationSchema>;

/**
 * Schema for team member invitation
 */
export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'finance', 'employer']),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

/**
 * Validation helper that returns formatted errors for React Hook Form
 */
export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; errors?: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(err => {
      if (err.path.length > 0) {
        const key = err.path.join('.');
        errors[key] = err.message;
      }
    });
    return { success: false, errors };
  }
  
  return { success: true };
}

export default {
  employeeSchema,
  loginSchema,
  batchPaySchema,
  automationSchema,
  inviteMemberSchema,
  validateWithZod,
};

/**
 * Permission constants for type-safe access control
 * Use these constants instead of hardcoded strings to prevent typos
 */

export const PERMISSIONS = {
  EXECUTE_PAYROLL: 'execute_payroll',
  MANAGE_RECIPIENTS: 'manage_recipients',
  MANAGE_TEAM: 'manage_team',
  EDIT_AUTOMATION: 'edit_automation',
  VIEW_REPORTS: 'view_reports',
  APPROVE_TRANSACTIONS: 'approve_transactions',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Default permissions by role
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.EXECUTE_PAYROLL,
    PERMISSIONS.MANAGE_RECIPIENTS,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.EDIT_AUTOMATION,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.APPROVE_TRANSACTIONS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  finance: [
    PERMISSIONS.EXECUTE_PAYROLL,
    PERMISSIONS.MANAGE_RECIPIENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  employer: [
    PERMISSIONS.VIEW_REPORTS,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
}

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
};

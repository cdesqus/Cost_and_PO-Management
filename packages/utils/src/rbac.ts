import type { RoleName } from "@repo/types";

export function hasRole(
  userRoles: RoleName[],
  required: RoleName | RoleName[],
): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];

  return requiredRoles.some((role) => userRoles.includes(role));
}

export function requireRole(
  userRoles: RoleName[],
  required: RoleName | RoleName[],
): void {
  if (!hasRole(userRoles, required)) {
    throw new Error("Forbidden: insufficient role");
  }
}
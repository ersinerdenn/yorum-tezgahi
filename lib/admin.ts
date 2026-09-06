import { hashEmail } from "./auth";
export function isAdminUser(user: { emailHash: string } | null): boolean {
  if (!user) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return user.emailHash === hashEmail(adminEmail);
}

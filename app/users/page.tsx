'use client';
import UserManagement from '@/components/UserManagement';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
}
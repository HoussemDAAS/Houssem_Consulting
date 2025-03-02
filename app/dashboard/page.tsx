// 
// app/dashboard/page.tsx
'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientBoard from '@/components/ClientBoard';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <ClientBoard />
    </DashboardLayout>
  );
}
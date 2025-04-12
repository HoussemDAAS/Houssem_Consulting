// 
// app/dashboard/page.tsx
'use client';
import ClientBoard from '@/components/ClientBoard';

import DashboardLayout from '@/components/layout/DashboardLayout';


export default function Dashboard() {
  return (
    <DashboardLayout>
      
      <ClientBoard />
    </DashboardLayout>
  );
}
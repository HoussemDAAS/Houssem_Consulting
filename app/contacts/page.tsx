// app/contacts/page.tsx
'use client';
import ClientContactBoard from '@/components/ClientContactBoard';
import DashboardLayout from '@/components/layout/DashboardLayout';


export default function ContactsPage() {
  return (
    <DashboardLayout>
      <ClientContactBoard />
    </DashboardLayout>
  );
}
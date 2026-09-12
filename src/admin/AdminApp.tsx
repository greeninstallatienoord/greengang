import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api } from '../lib/api'
import { AdminGuard } from './AdminAuth'
import { AdminLayout } from './AdminLayout'
import { AdminLoginPage } from './AdminLoginPage'
import { adminUrl } from './adminPath'

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)
const AppointmentsPage = lazy(() =>
  import('./pages/AppointmentsPage').then((module) => ({ default: module.AppointmentsPage })),
)
const AppointmentDetailPage = lazy(() =>
  import('./pages/AppointmentDetailPage').then((module) => ({
    default: module.AppointmentDetailPage,
  })),
)
const AppointmentNewPage = lazy(() =>
  import('./pages/AppointmentNewPage').then((module) => ({ default: module.AppointmentNewPage })),
)
const CustomersPage = lazy(() =>
  import('./pages/CustomersPage').then((module) => ({ default: module.CustomersPage })),
)
const CustomerDetailPage = lazy(() =>
  import('./pages/CustomerDetailPage').then((module) => ({ default: module.CustomerDetailPage })),
)
const QuotesPage = lazy(() =>
  import('./pages/QuotesPage').then((module) => ({ default: module.QuotesPage })),
)
const QuoteDetailPage = lazy(() =>
  import('./pages/QuoteDetailPage').then((module) => ({ default: module.QuoteDetailPage })),
)
const ContactListPage = lazy(() =>
  import('./pages/ContactListPage').then((module) => ({ default: module.ContactListPage })),
)
const ContactDetailPage = lazy(() =>
  import('./pages/ContactDetailPage').then((module) => ({ default: module.ContactDetailPage })),
)
const EmailsPage = lazy(() =>
  import('./pages/EmailsPage').then((module) => ({ default: module.EmailsPage })),
)
const EmailLogsPage = lazy(() =>
  import('./pages/EmailLogsPage').then((module) => ({ default: module.EmailLogsPage })),
)
const EmailLogDetailPage = lazy(() =>
  import('./pages/EmailLogDetailPage').then((module) => ({ default: module.EmailLogDetailPage })),
)
const TemplatesPage = lazy(() =>
  import('./pages/TemplatesPage').then((module) => ({ default: module.TemplatesPage })),
)
const TemplateDetailPage = lazy(() =>
  import('./pages/TemplateDetailPage').then((module) => ({ default: module.TemplateDetailPage })),
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)

function Fallback() {
  return (
    <div className="admin-app flex min-h-dvh items-center justify-center px-6">
      <p className="text-sm text-[var(--admin-muted)]">Beheerpagina wordt geladen…</p>
    </div>
  )
}

function LoginGate() {
  const [ready, setReady] = useState(false)
  const [inSession, setInSession] = useState(false)

  useEffect(() => {
    void api.admin.session().then((result) => {
      setInSession(result.ok)
      setReady(true)
    })
  }, [])

  if (!ready) return <Fallback />
  if (inSession) return <Navigate to={adminUrl('dashboard')} replace />
  return <AdminLoginPage />
}

export function AdminApp() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="login" element={<LoginGate />} />
        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to={adminUrl('dashboard')} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/new" element={<AppointmentNewPage />} />
          <Route path="appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="quotes/:id" element={<QuoteDetailPage />} />
          <Route path="contact" element={<ContactListPage />} />
          <Route path="contact/:id" element={<ContactDetailPage />} />
          <Route path="emails" element={<EmailsPage />} />
          <Route path="emails/logs" element={<EmailLogsPage />} />
          <Route path="emails/logs/:id" element={<EmailLogDetailPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:id" element={<TemplateDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={adminUrl('dashboard')} replace />} />
      </Routes>
    </Suspense>
  )
}

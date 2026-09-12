import { apiRequest } from './client'
import type { BookingRequest, ContactRequest, LeadRequest } from '../../types'

export const api = {
  health: () => apiRequest<{ ok: boolean }>('/api/health'),
  contact: (payload: ContactRequest) =>
    apiRequest<{ id: string; emailWarning?: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  quotes: (payload: LeadRequest) =>
    apiRequest<{ id: string; emailWarning?: string }>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  appointmentConfig: () =>
    apiRequest<{
      today: string
      maxDate: string
      workingDays: number[]
      blockedDates: string[]
      horizonDays: number
    }>('/api/appointments/config'),
  appointmentSlots: (date: string) =>
    apiRequest<{ date: string; slots: string[]; reason?: string }>(
      `/api/appointments/slots?date=${encodeURIComponent(date)}`,
    ),
  appointments: (payload: BookingRequest) =>
    apiRequest<{
      id: string
      status: string
      emailWarning?: string
    }>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  admin: {
    login: (email: string, password: string) =>
      apiRequest<{ ok: boolean }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => apiRequest<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
    session: () => apiRequest<{ email: string }>('/api/admin/session'),
    dashboard: () =>
      apiRequest<{
        appointmentsToday: number
        upcomingAppointments: number
        newQuotes: number
        unreadContacts: number
        pendingAppointments: number
        todayItems: Array<Record<string, string>>
        upcomingItems: Array<Record<string, string>>
        recent: Array<Record<string, string>>
        pendingQuoteItems: Array<Record<string, string>>
        recentContacts: Array<Record<string, string>>
        recentEmails: Array<Record<string, string>>
        appointmentStatusCounts: Record<string, number>
        quoteStatusCounts: Record<string, number>
      }>('/api/admin/dashboard'),
    appointments: () =>
      apiRequest<{ items: Array<Record<string, string>> }>('/api/admin/appointments'),
    appointment: (id: string) =>
      apiRequest<
        Record<string, string> & { emails?: Array<Record<string, string>> }
      >(`/api/admin/appointments/${id}`),
    createAppointment: (payload: Record<string, string>) =>
      apiRequest<{ id: string; status: string }>('/api/admin/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateAppointment: (id: string, status: string) =>
      apiRequest<{ ok: boolean; status: string; emailStatus?: string }>(
        `/api/admin/appointments/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
      ),
    customers: () =>
      apiRequest<{ items: Array<Record<string, string>> }>('/api/admin/customers'),
    customer: (id: string) =>
      apiRequest<
        Record<string, string> & {
          appointments: Array<Record<string, string>>
          quotes: Array<Record<string, string>>
          contacts: Array<Record<string, string>>
        }
      >(`/api/admin/customers/${id}`),
    quotes: () => apiRequest<{ items: Array<Record<string, string>> }>('/api/admin/quotes'),
    quote: (id: string) =>
      apiRequest<Record<string, string> & { emails?: Array<Record<string, string>> }>(
        `/api/admin/quotes/${id}`,
      ),
    updateQuote: (id: string, status: string) =>
      apiRequest<{ ok: boolean; status: string }>(`/api/admin/quotes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    contact: () => apiRequest<{ items: Array<Record<string, string>> }>('/api/admin/contact'),
    contactItem: (id: string) =>
      apiRequest<Record<string, string> & { emails?: Array<Record<string, string>> }>(
        `/api/admin/contact/${id}`,
      ),
    updateContact: (id: string, status: string) =>
      apiRequest<{ ok: boolean; status: string }>(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    emails: () => apiRequest<{ items: Array<Record<string, string>> }>('/api/admin/emails'),
    email: (id: string) => apiRequest<Record<string, string>>(`/api/admin/emails/${id}`),
    recipients: (query: string) =>
      apiRequest<{ items: Array<Record<string, string>> }>(
        `/api/admin/recipients?q=${encodeURIComponent(query)}`,
      ),
    previewEmail: (payload: Record<string, unknown>) =>
      apiRequest<{ subject: string; text: string; html: string }>('/api/admin/emails/preview', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    sendEmail: (payload: Record<string, unknown>) =>
      apiRequest<{ ok: boolean; status: string; id?: string }>('/api/admin/emails', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    templates: () =>
      apiRequest<{
        items: Array<Record<string, string> & { compose?: number }>
        variables?: Array<{ key: string; label: string }>
      }>('/api/admin/templates'),
    template: (id: string) =>
      apiRequest<
        Record<string, string> & { variables?: Array<{ key: string; label: string }> }
      >(`/api/admin/templates/${id}`),
    updateTemplate: (id: string, payload: { subject: string; body_text: string }) =>
      apiRequest<{ ok: boolean }>(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    settings: () =>
      apiRequest<{
        business: Record<string, string>
        appointments: Record<string, string>
        email: { from_email: string; configured: boolean }
        admin: Record<string, string>
        system: {
          environment: string
          siteUrl: string
          adminPath: string
          sessionConfigured: boolean
        }
      }>('/api/admin/settings'),
    updateSettings: (values: Record<string, string>) =>
      apiRequest<{ ok: boolean }>('/api/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({ values }),
      }),
  },
}

import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ADMIN_BASE_PATH } from './admin/adminPath'
import { LoadingScreen } from './components/loading/BrandLoader'
import { ScrollToTop } from './components/ScrollToTop'
import { legalDocs } from './data/legal'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const AppointmentPage = lazy(() =>
  import('./pages/AppointmentPage').then((module) => ({
    default: module.AppointmentPage,
  })),
)
const AreaDetailPage = lazy(() =>
  import('./pages/AreaDetailPage').then((module) => ({
    default: module.AreaDetailPage,
  })),
)
const AreaIndexPage = lazy(() =>
  import('./pages/AreaPage').then((module) => ({ default: module.AreaIndexPage })),
)
const AreaServicePage = lazy(() =>
  import('./pages/AreaServicePage').then((module) => ({
    default: module.AreaServicePage,
  })),
)
const BlogCategoryPage = lazy(() =>
  import('./pages/BlogCategoryPage').then((module) => ({
    default: module.BlogCategoryPage,
  })),
)
const BlogArticlePage = lazy(() =>
  import('./pages/BlogArticlePage').then((module) => ({
    default: module.BlogArticlePage,
  })),
)
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((module) => ({ default: module.BlogPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((module) => ({ default: module.FaqPage })),
)
const LegalPage = lazy(() =>
  import('./pages/LegalPage').then((module) => ({ default: module.LegalPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
const QuotePage = lazy(() =>
  import('./pages/QuotePage').then((module) => ({ default: module.QuotePage })),
)
const ServicePage = lazy(() =>
  import('./pages/ServicePage').then((module) => ({ default: module.ServicePage })),
)
const WarmtepompPage = lazy(() =>
  import('./pages/WarmtepompPage').then((module) => ({
    default: module.WarmtepompPage,
  })),
)
const WorkPage = lazy(() =>
  import('./pages/WorkPage').then((module) => ({ default: module.WorkPage })),
)
const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((module) => ({ default: module.AdminApp })),
)

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen variant="page" />}>
      <Routes>
          <Route path={`${ADMIN_BASE_PATH.slice(1)}/*`} element={<AdminApp />} />
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="cv-ketel" element={<ServicePage slug="cv-ketel" />} />
            <Route path="airco" element={<ServicePage slug="airco" />} />
            <Route path="warmtepomp" element={<WarmtepompPage />} />
            <Route
              path="service-onderhoud"
              element={<ServicePage slug="service-onderhoud" />}
            />
            <Route path="over-ons" element={<AboutPage />} />
            <Route path="werk" element={<WorkPage />} />
            <Route path="werkgebied" element={<AreaIndexPage />} />
            <Route path="werkgebied/:plaats" element={<AreaDetailPage />} />
            <Route
              path="werkgebied/:plaats/:dienst"
              element={<AreaServicePage />}
            />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/categorie/:categorie" element={<BlogCategoryPage />} />
            <Route path="blog/:slug" element={<BlogArticlePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="offerte-aanvragen" element={<QuotePage />} />
            <Route path="afspraak-maken" element={<AppointmentPage />} />
            <Route path="veelgestelde-vragen" element={<FaqPage />} />
            <Route path="privacy" element={<LegalPage doc={legalDocs.privacy} />} />
            <Route path="cookies" element={<LegalPage doc={legalDocs.cookies} />} />
            <Route
              path="algemene-voorwaarden"
              element={<LegalPage doc={legalDocs.terms} />}
            />
            <Route
              path="voorwaarden"
              element={<Navigate to="/algemene-voorwaarden" replace />}
            />
            <Route
              path="disclaimer"
              element={<LegalPage doc={legalDocs.disclaimer} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Landing from '@/pages/Landing'
import Admin from '@/pages/Admin'
import Profile from '@/pages/Profile'
import Support from '@/pages/Support'
import Articles from '@/pages/Articles'
import ArticleDetail from '@/pages/ArticleDetail'
import StaticPage from '@/pages/StaticPage'
import PaymentSuccess from '@/pages/PaymentSuccess'
import PaymentCancel from '@/pages/PaymentCancel'
import ComponentPreview from '@/pages/ComponentPreview'
import CmsDashboard from '@/pages/cms/CmsDashboard'
import Inquiries from '@/pages/cms/Inquiries'
import Products from '@/pages/cms/Products'
import ApplicationAreas from '@/pages/cms/ApplicationAreas'
import CaseStudies from '@/pages/cms/CaseStudies'
import Pipeline from '@/pages/cms/Pipeline'
import Documents from '@/pages/cms/Documents'
import BlogArticles from '@/pages/cms/BlogArticles'
import PageSettings from '@/pages/cms/PageSettings'
import GeneralSettings from '@/pages/cms/GeneralSettings'
import AdminUsers from '@/pages/cms/AdminUsers'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/store/useAuth'

export default function App() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/preview" element={<ComponentPreview />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/page/:slug" element={<StaticPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/app" replace /> : <Login />}
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app"     element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* Admin + CMS */}
        <Route element={<AdminRoute />}>
          <Route path="/admin"                     element={<Admin />} />
          <Route path="/cms"                       element={<CmsDashboard />} />
          <Route path="/cms/inquiries"             element={<Inquiries />} />
          <Route path="/cms/products"              element={<Products />} />
          <Route path="/cms/application-areas"     element={<ApplicationAreas />} />
          <Route path="/cms/case-studies"          element={<CaseStudies />} />
          <Route path="/cms/pipeline"              element={<Pipeline />} />
          <Route path="/cms/documents"             element={<Documents />} />
          <Route path="/cms/articles"              element={<BlogArticles />} />
          <Route path="/cms/page-settings"         element={<PageSettings />} />
          <Route path="/cms/general-settings"      element={<GeneralSettings />} />
          <Route path="/cms/admin-users"           element={<AdminUsers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
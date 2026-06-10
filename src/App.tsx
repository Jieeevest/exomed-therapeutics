import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PageLoader } from '@/components/PageLoader'
import { usePageLoader } from '@/store/usePageLoader'
import Login from '@/pages/Login'
import Landing from '@/pages/Landing'
import Articles from '@/pages/Articles'
import ArticleDetail from '@/pages/ArticleDetail'
import StaticPage from '@/pages/StaticPage'
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
import ClientUsers from '@/pages/cms/ClientUsers'
import InternalUsers from '@/pages/cms/InternalUsers'
import { AdminRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/store/useAuth'

function RouteChangeTracker() {
  const location = useLocation()
  const push = usePageLoader((s) => s.push)
  const pop = usePageLoader((s) => s.pop)

  useEffect(() => {
    push()
    const t = setTimeout(pop, 600)
    return () => { clearTimeout(t); pop() }
  }, [location.pathname, push, pop])

  return null
}

export default function App() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)

  return (
    <BrowserRouter>
      <PageLoader />
      <RouteChangeTracker />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/page/:slug" element={<StaticPage />} />

        {/* Login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/cms" replace /> : <Login />}
        />

        {/* CMS — admin only */}
        <Route element={<AdminRoute />}>
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
          <Route path="/cms/users"                 element={<ClientUsers />} />
          <Route path="/cms/internal-users"        element={<InternalUsers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

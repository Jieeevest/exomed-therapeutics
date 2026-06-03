export type SubscriptionTier = 'starter' | 'pro'

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T = unknown> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
}

// --- CMS Types ---

export interface Inquiry {
  id: string
  name: string
  specialty: string
  clinic: string
  city: string
  whatsapp: string
  product_interest: string
  message: string
  status: 'baru' | 'diproses' | 'selesai'
  notes?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  series: 'amniotic' | 'placental'
  nanoparticles: string
  type: string
  description: string
  status: 'aktif' | 'special_order' | 'nonaktif'
  image_url?: string
}

export interface ApplicationArea {
  id: string
  name: string
  specialty: string
  description: string
  icon: string
  order: number
  is_active: boolean
}

export interface CaseStudyMetric {
  label: string
  value: string
}

export interface CaseStudyImage {
  src: string
  caption: string
}

export interface CaseStudy {
  id: string
  specialty: string
  title: string
  patient_description: string
  images?: CaseStudyImage[]
  metrics: CaseStudyMetric[]
  disclaimer: string
  is_published: boolean
  created_at: string
}

export interface PipelineItem {
  id: string
  product_name: string
  platform: string
  stage: 'pre-clinical' | 'research' | 'special-order' | 'early-research'
  order: number
}

export interface CmsDocument {
  id: string
  name: string
  category: 'coa' | 'legal' | 'brosur' | 'protokol'
  access: 'publik' | 'gated'
  file_url: string
  uploaded_at: string
}

export interface BlogArticle {
  id: string
  title: string
  category: 'edukasi-exosome' | 'riset' | 'update-perusahaan'
  content: string
  thumbnail_url?: string
  author: string
  published_at: string
  status: 'draft' | 'publish'
  slug: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super-admin' | 'editor' | 'viewer'
  created_at: string
}

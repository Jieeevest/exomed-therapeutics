import { useState, useRef } from 'react'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/api'
import { API_URLS } from '@/constants/apiUrls'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  required?: boolean
  folder?: string
  hint?: string
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  label,
  required,
  folder = 'cms',
  hint,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isPDF = accept.includes('pdf')

  const upload = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetchWithAuth(`${API_URLS.cms.mediaUpload}?folder=${folder}`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        onChange(data.data.url)
      } else {
        setError(data.message ?? 'Upload gagal')
      }
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file: File | undefined) => {
    if (file) upload(file)
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {value ? (
        <div className="relative group border border-border rounded-xl overflow-hidden bg-background/50">
          {isPDF ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{value.split('/').pop()}</span>
            </div>
          ) : (
            <img src={value} alt="preview" className="w-full h-36 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            handleFile(e.dataTransfer.files[0])
          }}
          className={cn(
            'border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all',
            dragging
              ? 'border-primary/60 bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/20',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {uploading ? 'Mengupload...' : 'Klik atau seret file ke sini'}
            </p>
            {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

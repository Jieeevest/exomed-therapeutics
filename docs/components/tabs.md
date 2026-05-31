# Tabs

Berbasis `@radix-ui/react-tabs` dengan dua variant visual.

## Preview

<iframe src="/preview?id=tabs" style="width:100%;height:280px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { Tabs, TabContent } from '@/components/Tabs'
```

## Variant Underline

Dipakai untuk tab di dalam panel (Dashboard, sisi kanan).

```tsx
import { User, CreditCard, Bell } from 'lucide-react'

const [tab, setTab] = useState('profile')

<Tabs
  variant="underline"
  tabs={[
    { id: 'profile',  label: 'Profil',     icon: <User className="w-4 h-4" /> },
    { id: 'billing',  label: 'Billing',    icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notif',    label: 'Notifikasi', icon: <Bell className="w-4 h-4" /> },
  ]}
  value={tab}
  onValueChange={setTab}
>
  <TabContent value="profile" className="pt-4">
    <p>Konten profil</p>
  </TabContent>
  <TabContent value="billing" className="pt-4">
    <p>Konten billing</p>
  </TabContent>
  <TabContent value="notif" className="pt-4">
    <p>Konten notifikasi</p>
  </TabContent>
</Tabs>
```

## Variant Pill

Dipakai untuk toggle seperti Login/Register.

```tsx
const [mode, setMode] = useState('login')

<Tabs
  variant="pill"
  tabs={[
    { id: 'login',    label: 'LOGIN'    },
    { id: 'register', label: 'REGISTER' },
  ]}
  value={mode}
  onValueChange={setMode}
>
  <TabContent value="login">
    <LoginForm />
  </TabContent>
  <TabContent value="register">
    <RegisterForm />
  </TabContent>
</Tabs>
```

## Dengan Badge di Tab

```tsx
<Tabs
  variant="underline"
  tabs={[
    {
      id: 'tickets',
      label: 'Tiket',
      badge: (
        <span className="ml-1 bg-red-500 text-white text-[9px] font-bold
                         px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )
    },
  ]}
  value={tab}
  onValueChange={setTab}
>
  {/* ... */}
</Tabs>
```

## Props

### Tabs

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `tabs` | `Tab[]` | — | Daftar tab |
| `value` | `string` | — | Tab aktif (controlled) |
| `onValueChange` | `(value: string) => void` | — | Callback saat tab berubah |
| `variant` | `underline \| pill` | `underline` | Tampilan visual |
| `children` | `ReactNode` | — | `TabContent` components |
| `className` | `string` | — | Class untuk wrapper |

### Tab Object

```ts
interface Tab {
  id: string
  label: string
  icon?: ReactNode    // opsional
  badge?: ReactNode   // opsional — muncul setelah label
}
```

## TabContent

Re-export dari `@radix-ui/react-tabs`. Props utama:

| Prop | Tipe | Keterangan |
|---|---|---|
| `value` | `string` | Harus cocok dengan `id` di `tabs` array |
| `className` | `string` | Class tambahan |
| `children` | `ReactNode` | Konten tab |

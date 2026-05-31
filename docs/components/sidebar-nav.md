# SidebarNav

Daftar navigasi sidebar dengan active state, icon, dan badge opsional.

## Preview

<iframe src="/preview?id=sidebarnav" style="width:100%;height:250px;border:none;border-radius:12px;" loading="lazy" />

## Import

```ts
import { SidebarNav } from '@/components/SidebarNav'
```

## Contoh

```tsx
import { Users, CreditCard, Ticket, BookOpen } from 'lucide-react'

const [activeTab, setActiveTab] = useState('users')

<SidebarNav
  items={[
    { id: 'users',    label: 'User Management', icon: Users    },
    { id: 'payments', label: 'Transactions',     icon: CreditCard },
    { id: 'tickets',  label: 'Support Tickets',  icon: Ticket   },
    { id: 'articles', label: 'Content & CMS',    icon: BookOpen },
  ]}
  activeId={activeTab}
  onSelect={setActiveTab}
/>
```

## Dengan Badge

```tsx
<SidebarNav
  items={[
    {
      id: 'tickets',
      label: 'Tiket Support',
      icon: Ticket,
      badge: (
        <span className="bg-red-500 text-white text-[9px] font-black
                         px-1.5 py-0.5 rounded-full">
          {openTickets}
        </span>
      )
    },
  ]}
  activeId={activeTab}
  onSelect={setActiveTab}
/>
```

## Dalam Layout Sidebar

```tsx
<aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col sticky top-0 h-screen">
  <div className="p-6 border-b border-white/5">
    <Logo variant="horizontal" className="h-8 w-auto" />
  </div>

  <nav className="flex-1 p-4 overflow-y-auto">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
      Menu Utama
    </p>
    <SidebarNav
      items={NAV_ITEMS}
      activeId={activeTab}
      onSelect={setActiveTab}
    />
  </nav>

  <div className="p-4 border-t border-white/5">
    <button onClick={() => navigate('/app')} className="...">
      Kembali ke App
    </button>
  </div>
</aside>
```

## Props

| Prop | Tipe | Keterangan |
|---|---|---|
| `items` | `NavItem[]` | Daftar item navigasi |
| `activeId` | `string` | ID item yang aktif |
| `onSelect` | `(id: string) => void` | Callback saat item dipilih |
| `className` | `string` | Class tambahan untuk `<nav>` |

### NavItem

```ts
interface NavItem {
  id: string
  label: string
  icon: React.ElementType   // Lucide icon component (bukan JSX element)
  badge?: React.ReactNode   // opsional
}
```

::: tip
`icon` menerima komponen Lucide (tanpa JSX), bukan element. Benar: `icon: Users`. Salah: `icon: <Users />`.
:::

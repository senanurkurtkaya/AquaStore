import * as Dialog from '@radix-ui/react-dialog'
import { Droplets, Menu, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/brands', label: 'Markalar' },
  { to: '/categories', label: 'Kategoriler' },
  { to: '/products', label: 'Ürünler' },
  { to: '/customers', label: 'Müşteriler' },
  { to: '/orders', label: 'Siparişler' },
  { to: '/orders/new', label: 'Yeni sipariş' },
]

function NavItems({ closeOnClick = false }: { closeOnClick?: boolean }) {
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const item = (
          <NavLink
            to={link.to}
            end={link.to === '/orders'}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/20 text-white' : 'text-cyan-50 hover:bg-white/10'}`
            }
          >
            {link.label}
          </NavLink>
        )
        return closeOnClick ? (
          <Dialog.Close key={link.to} asChild>
            {item}
          </Dialog.Close>
        ) : (
          <span key={link.to}>{item}</span>
        )
      })}
    </nav>
  )
}

function BrandMark() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-sky-950">
        <Droplets className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-semibold text-white">AquaStore</p>
        <p className="text-xs text-cyan-100">Yönetim paneli</p>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="hidden bg-gradient-to-b from-sky-950 to-cyan-800 p-5 md:flex md:min-h-screen md:flex-col">
        <BrandMark />
        <NavItems />
        <p className="mt-auto pt-8 text-xs leading-5 text-cyan-100">Giriş koruması yok. Panel yerel API’ye açık bağlanır.</p>
      </aside>
      <div>
        <header className="flex items-center justify-between bg-gradient-to-r from-sky-950 to-cyan-700 px-4 py-3 text-white md:hidden">
          <div className="flex items-center gap-2 font-semibold">
            <Droplets className="h-5 w-5" />
            AquaStore
          </div>
          <Dialog.Root>
            <Dialog.Trigger className="rounded-lg p-2 hover:bg-white/10" aria-label="Menüyü aç">
              <Menu className="h-5 w-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-slate-950/40" />
              <Dialog.Content className="fixed inset-y-0 left-0 flex w-72 flex-col bg-gradient-to-b from-sky-950 to-cyan-800 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-white">Menü</Dialog.Title>
                  <Dialog.Description className="sr-only">Yönetim sayfaları</Dialog.Description>
                  <Dialog.Close className="rounded-lg p-2 text-white hover:bg-white/10" aria-label="Menüyü kapat">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <NavItems closeOnClick />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </header>
        <main className="mx-auto w-full max-w-6xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

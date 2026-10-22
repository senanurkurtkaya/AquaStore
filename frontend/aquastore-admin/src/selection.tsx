import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Customer } from './api/types.ts'

const storageKey = 'aquastore-admin.customer'

function readStoredCustomer(): Customer | null {
  const raw = sessionStorage.getItem(storageKey)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Customer
    if (!parsed?.id) return null
    return parsed
  } catch {
    return null
  }
}

const CustomerSelectionContext = createContext<{
  customer: Customer | null
  selectCustomer: (customer: Customer) => void
} | null>(null)

export function CustomerSelectionProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => readStoredCustomer())
  const value = useMemo(
    () => ({
      customer,
      selectCustomer: (next: Customer) => {
        sessionStorage.setItem(storageKey, JSON.stringify(next))
        setCustomer(next)
      },
    }),
    [customer],
  )
  return <CustomerSelectionContext.Provider value={value}>{children}</CustomerSelectionContext.Provider>
}

export function useCustomerSelection() {
  const context = useContext(CustomerSelectionContext)
  if (!context) throw new Error('Müşteri seçimi hazır değil.')
  return context
}

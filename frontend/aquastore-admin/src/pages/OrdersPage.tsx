import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ordersApi } from '../api/aquastore.ts'
import { ApiError } from '../api/client.ts'
import type { Order } from '../api/types.ts'
import { Alert, Button, EmptyState, Panel, Spinner, TextField } from '../components/ui.tsx'
import { formatDate, formatMoney, isGuid, orderStatusLabels } from '../format.ts'

export function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lookupId, setLookupId] = useState('')
  const [lookupError, setLookupError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const list = await ordersApi.list()
        if (active) setOrders(list)
      } catch (caught) {
        if (active) setError(caught instanceof ApiError ? caught.detail : 'Siparişler alınamadı.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  function onLookup(event: FormEvent) {
    event.preventDefault()
    if (!isGuid(lookupId)) {
      setLookupError('Geçerli bir sipariş kimliği girin.')
      return
    }
    navigate(`/orders/${lookupId.trim()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sky-950">Siparişler</h1>
          <p className="mt-1 text-sm text-slate-600">Liste mevcut sipariş servisinden gelir.</p>
        </div>
        <Link className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white" to="/orders/new">Yeni sipariş</Link>
      </div>
      <Panel title="Kimlikle aç">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onLookup}>
          <div className="flex-1">
            <TextField label="Sipariş kimliği" value={lookupId} error={lookupError} onChange={(event) => setLookupId(event.target.value)} />
          </div>
          <Button type="submit">Detayı aç</Button>
        </form>
      </Panel>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Panel title="Liste">
        {loading ? <Spinner /> : null}
        {!loading && orders.length === 0 ? <EmptyState>Henüz sipariş yok.</EmptyState> : null}
        {!loading && orders.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{formatMoney(order.totalAmount)}</p>
                  <p className="text-sm text-slate-600">{formatDate(order.orderDate)} · {orderStatusLabels[order.status] ?? order.status}</p>
                  <p className="break-all text-xs text-slate-500">{order.id}</p>
                </div>
                <Link className="text-sm font-semibold text-cyan-700" to={`/orders/${order.id}`}>Detay</Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  )
}

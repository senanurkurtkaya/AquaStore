import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ordersApi, productsApi } from '../api/aquastore.ts'
import { ApiError } from '../api/client.ts'
import type { Order, Product } from '../api/types.ts'
import { Alert, EmptyState, Panel, Spinner } from '../components/ui.tsx'
import { formatDate, formatMoney, invoiceTypeLabels, orderStatusLabels } from '../format.ts'

export function OrderDetailPage() {
  const { orderId = '' } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [found, productList] = await Promise.all([ordersApi.getById(orderId), productsApi.list()])
        if (!active) return
        setOrder(found)
        setProducts(productList)
      } catch (caught) {
        if (!active) return
        setOrder(null)
        setError(caught instanceof ApiError ? caught.detail : 'Sipariş alınamadı.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [orderId])

  const productName = (id: string) => products.find((product) => product.id === id)?.name ?? id

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sky-950">Sipariş detayı</h1>
          <p className="mt-1 break-all text-sm text-slate-600">{orderId}</p>
        </div>
        <Link className="text-sm font-semibold text-cyan-700" to="/orders">Sipariş listesine dön</Link>
      </div>
      {loading ? <Spinner /> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      {!loading && !error && !order ? <EmptyState>Sipariş bulunamadı.</EmptyState> : null}
      {order ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Kayıtlı toplam" value={formatMoney(order.totalAmount)} />
            <Info label="Durum" value={orderStatusLabels[order.status] ?? String(order.status)} />
            <Info label="Fatura tipi" value={invoiceTypeLabels[order.invoiceType] ?? String(order.invoiceType)} />
            <Info label="Tarih" value={formatDate(order.orderDate)} />
          </div>
          <Panel title="Satırlar">
            {order.items.length === 0 ? <EmptyState>Satır yok.</EmptyState> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-2 font-medium">Ürün</th>
                      <th className="py-2 font-medium">Miktar</th>
                      <th className="py-2 font-medium">Birim fiyat</th>
                      <th className="py-2 font-medium">Satır toplamı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="py-3">{productName(item.productId)}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">{formatMoney(item.unitPrice)}</td>
                        <td className="py-3">{formatMoney(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-4 text-right text-lg font-semibold text-cyan-800">Genel toplam {formatMoney(order.totalAmount)}</p>
            <p className="mt-1 text-right text-xs text-slate-500">Birim fiyatlar ve toplam, sipariş kaydındaki sunucu değerleridir.</p>
          </Panel>
        </>
      ) : null}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-100 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  )
}

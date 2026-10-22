import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { customersApi, ordersApi, productsApi } from '../api/aquastore.ts'
import { ApiError } from '../api/client.ts'
import type { Address, Product } from '../api/types.ts'
import { Alert, Button, EmptyState, Panel, SelectField, Spinner, TextField } from '../components/ui.tsx'
import { formatMoney, isGuid } from '../format.ts'
import { useCustomerSelection } from '../selection.tsx'

type DraftLine = { key: string; productId: string; quantity: string }

function newLine(): DraftLine {
  return { key: crypto.randomUUID(), productId: '', quantity: '1' }
}

export function OrderCreatePage() {
  const navigate = useNavigate()
  const { customer, selectCustomer } = useCustomerSelection()
  const [lookupId, setLookupId] = useState(customer?.id ?? '')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [deliveryAddressId, setDeliveryAddressId] = useState('')
  const [invoiceAddressId, setInvoiceAddressId] = useState('')
  const [invoiceType, setInvoiceType] = useState('0')
  const [lines, setLines] = useState<DraftLine[]>([newLine()])
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function loadProducts() {
    setProducts(await productsApi.list())
  }

  async function loadCustomer(id: string) {
    setLoading(true)
    setError('')
    try {
      const [found, addressList] = await Promise.all([customersApi.getById(id), customersApi.listAddresses(id)])
      selectCustomer(found)
      setLookupId(found.id)
      setAddresses(addressList)
      setDeliveryAddressId('')
      setInvoiceAddressId('')
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.detail : 'Müşteri alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts().catch((caught: unknown) => {
      setError(caught instanceof ApiError ? caught.detail : 'Ürünler alınamadı.')
    })
    if (customer) void loadCustomer(customer.id)
  }, [])

  const estimate = useMemo(
    () => lines.reduce((sum, line) => {
      const product = products.find((item) => item.id === line.productId)
      const quantity = Number(line.quantity)
      if (!product || !Number.isInteger(quantity) || quantity <= 0) return sum
      return sum + product.price * quantity
    }, 0),
    [lines, products],
  )

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (!customer) next.customerId = 'Müşteri seçin.'
    if (!deliveryAddressId) next.deliveryAddressId = 'Teslimat adresi zorunludur.'
    if (!invoiceAddressId) next.invoiceAddressId = 'Fatura adresi zorunludur.'
    if (lines.length === 0) next.orderItems = 'Siparişte en az bir ürün olmalıdır.'
    lines.forEach((line, index) => {
      if (!line.productId) next[`orderItems.${index}.productId`] = 'Ürün seçilmelidir.'
      const quantity = Number(line.quantity)
      if (!Number.isInteger(quantity) || quantity <= 0) next[`orderItems.${index}.quantity`] = "Ürün adedi 0'dan büyük olmalıdır."
    })
    return next
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!customer) return
    const nextErrors = validate()
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    setError('')
    try {
      const created = await ordersApi.create({
        customerId: customer.id,
        deliveryAddressId,
        invoiceAddressId,
        invoiceType: Number(invoiceType),
        orderItems: lines.map((line) => ({ productId: line.productId, quantity: Number(line.quantity) })),
      })
      navigate(`/orders/${created.id}`)
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(caught.fieldErrors)
        setError(caught.detail)
        if (caught.status === 409) {
          try {
            await loadProducts()
          } catch {
            setError(`${caught.detail} Stok listesi yenilenemedi.`)
          }
        }
      } else setError('Sipariş oluşturulamadı.')
      setPending(false)
    }
  }

  const addressOptions = addresses.map((address) => ({
    value: address.id,
    label: `${address.title} · ${address.district}, ${address.city}`,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sky-950">Yeni sipariş</h1>
        <p className="mt-1 text-sm text-slate-600">Fiyat ve toplam gönderilmez. Tahmini tutar yalnızca ekrandaki güncel ürün fiyatlarından hesaplanır.</p>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Panel title="Müşteri">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={(event) => { event.preventDefault(); if (!isGuid(lookupId)) { setError('Geçerli bir müşteri kimliği girin.'); return }; void loadCustomer(lookupId.trim()) }}>
          <div className="flex-1">
            <TextField label="Müşteri kimliği" value={lookupId} error={fieldErrors.customerId} onChange={(event) => setLookupId(event.target.value)} />
          </div>
          <Button type="submit" pending={loading}>Müşteriyi getir</Button>
        </form>
        {customer ? <p className="mt-3 text-sm text-sky-950">Seçili müşteri: {customer.firstName} {customer.lastName}</p> : <div className="mt-3"><EmptyState>Müşteri listesi yok. Kimlik girin veya müşteri ekranında oluşturun.</EmptyState></div>}
      </Panel>
      <form className="space-y-6" onSubmit={onSubmit}>
        <Panel title="Adresler">
          {loading ? <Spinner /> : null}
          {!loading && customer && addresses.length === 0 ? <EmptyState>Bu müşterinin adresi yok. Önce adres ekleyin.</EmptyState> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField label="Teslimat adresi" value={deliveryAddressId} placeholder="Adres seçin" options={addressOptions} error={fieldErrors.deliveryAddressId} onChange={setDeliveryAddressId} disabled={!customer} />
            <SelectField label="Fatura adresi" value={invoiceAddressId} placeholder="Adres seçin" options={addressOptions} error={fieldErrors.invoiceAddressId} onChange={setInvoiceAddressId} disabled={!customer} />
          </div>
          <div className="mt-4 max-w-sm">
            <SelectField label="Fatura tipi" value={invoiceType} placeholder="Fatura tipi" options={[{ value: '0', label: 'Bireysel' }, { value: '1', label: 'Kurumsal' }]} onChange={setInvoiceType} />
          </div>
        </Panel>
        <Panel title="Ürünler">
          <div className="space-y-4">
            {lines.map((line, index) => (
              <div key={line.key} className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-[1fr_140px_auto] md:items-end">
                <SelectField
                  label="Ürün"
                  value={line.productId}
                  placeholder="Ürün seçin"
                  options={products.map((product) => ({ value: product.id, label: `${product.name} · stok ${product.stock} · ${formatMoney(product.price)}` }))}
                  error={fieldErrors[`orderItems.${index}.productId`]}
                  onChange={(productId) => setLines(lines.map((item) => item.key === line.key ? { ...item, productId } : item))}
                />
                <TextField label="Miktar" inputMode="numeric" value={line.quantity} error={fieldErrors[`orderItems.${index}.quantity`]} onChange={(event) => setLines(lines.map((item) => item.key === line.key ? { ...item, quantity: event.target.value } : item))} />
                <Button type="button" tone="secondary" onClick={() => setLines(lines.filter((item) => item.key !== line.key))} disabled={lines.length === 1}>Satırı çıkar</Button>
              </div>
            ))}
          </div>
          {fieldErrors.orderItems ? <p className="mt-2 text-sm text-rose-700">{fieldErrors.orderItems}</p> : null}
          <div className="mt-4">
            <Button type="button" tone="secondary" onClick={() => setLines([...lines, newLine()])}>Ürün satırı ekle</Button>
          </div>
        </Panel>
        <div className="flex flex-col gap-4 rounded-2xl border border-cyan-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Tahmini toplam</p>
            <p className="text-2xl font-semibold text-cyan-800">{formatMoney(estimate)}</p>
            <p className="mt-1 max-w-xl text-xs text-slate-500">Bu tutar listedeki güncel ürün fiyatlarıyla hesaplanır. Kayıtlı sipariş tutarı, işlem başarılı olduktan sonra API’nin döndürdüğü değerdir.</p>
          </div>
          <Button type="submit" pending={pending}>Siparişi oluştur</Button>
        </div>
      </form>
    </div>
  )
}

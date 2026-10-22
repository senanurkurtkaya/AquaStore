import { useState, type FormEvent } from 'react'
import { customersApi } from '../api/aquastore.ts'
import { ApiError } from '../api/client.ts'
import type { Address } from '../api/types.ts'
import { Alert, Button, EmptyState, Panel, Spinner, TextAreaField, TextField } from '../components/ui.tsx'
import { isGuid } from '../format.ts'
import { useCustomerSelection } from '../selection.tsx'

const emptyCustomer = { firstName: '', lastName: '', email: '', phone: '' }
const emptyAddress = { title: '', country: 'Türkiye', city: '', district: '', street: '', postalCode: '', description: '' }

export function CustomersPage() {
  const { customer, selectCustomer } = useCustomerSelection()
  const [lookupId, setLookupId] = useState(customer?.id ?? '')
  const [customerForm, setCustomerForm] = useState(emptyCustomer)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingCustomer, setPendingCustomer] = useState(false)
  const [pendingAddress, setPendingAddress] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({})
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [lookupError, setLookupError] = useState('')

  async function loadCustomer(id: string) {
    setLoading(true)
    setError('')
    setLookupError('')
    try {
      const [found, addressList] = await Promise.all([customersApi.getById(id), customersApi.listAddresses(id)])
      selectCustomer(found)
      setLookupId(found.id)
      setAddresses(addressList)
    } catch (caught) {
      setLookupError(caught instanceof ApiError ? caught.detail : 'Müşteri alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  function validateCustomer(): Record<string, string> {
    const next: Record<string, string> = {}
    if (customerForm.firstName.trim() === '') next.firstName = 'Ad boş olamaz.'
    else if (customerForm.firstName.trim().length > 50) next.firstName = 'Ad en fazla 50 karakter olabilir.'
    if (customerForm.lastName.trim() === '') next.lastName = 'Soyad boş olamaz.'
    else if (customerForm.lastName.trim().length > 50) next.lastName = 'Soyad en fazla 50 karakter olabilir.'
    if (customerForm.email.trim() === '') next.email = 'E-posta boş olamaz.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email.trim())) next.email = 'Geçerli bir e-posta girilmelidir.'
    else if (customerForm.email.trim().length > 100) next.email = 'E-posta en fazla 100 karakter olabilir.'
    if (customerForm.phone.trim().length > 20) next.phone = 'Telefon en fazla 20 karakter olabilir.'
    return next
  }

  function validateAddress(): Record<string, string> {
    const limits: Record<keyof typeof emptyAddress, [string, number]> = {
      title: ['Adres başlığı', 100],
      country: ['Ülke', 100],
      city: ['İl', 100],
      district: ['İlçe', 100],
      street: ['Sokak', 250],
      postalCode: ['Posta kodu', 20],
      description: ['Adres açıklaması', 500],
    }
    const next: Record<string, string> = {}
    for (const [key, [label, max]] of Object.entries(limits) as [keyof typeof emptyAddress, [string, number]][]) {
      const value = addressForm[key].trim()
      if (value === '') next[key] = `${label} boş olamaz.`
      else if (value.length > max) next[key] = `${label} en fazla ${max} karakter olabilir.`
    }
    return next
  }

  async function onCreateCustomer(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateCustomer()
    setCustomerErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setPendingCustomer(true)
    setError('')
    setSuccess('')
    try {
      const created = await customersApi.create({
        firstName: customerForm.firstName.trim(),
        lastName: customerForm.lastName.trim(),
        email: customerForm.email.trim(),
        phone: customerForm.phone.trim() === '' ? null : customerForm.phone.trim(),
      })
      selectCustomer(created)
      setLookupId(created.id)
      setAddresses([])
      setCustomerForm(emptyCustomer)
      setSuccess('Müşteri oluşturuldu ve seçildi.')
    } catch (caught) {
      if (caught instanceof ApiError) {
        setCustomerErrors(caught.fieldErrors)
        setError(caught.detail)
      } else setError('Müşteri oluşturulamadı.')
    } finally {
      setPendingCustomer(false)
    }
  }

  async function onLookup(event: FormEvent) {
    event.preventDefault()
    if (!isGuid(lookupId)) {
      setLookupError('Geçerli bir müşteri kimliği girin.')
      return
    }
    await loadCustomer(lookupId.trim())
  }

  async function onSaveAddress(event: FormEvent) {
    event.preventDefault()
    if (!customer) return
    const nextErrors = validateAddress()
    setAddressErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setPendingAddress(true)
    setError('')
    setSuccess('')
    const body = {
      title: addressForm.title.trim(),
      country: addressForm.country.trim(),
      city: addressForm.city.trim(),
      district: addressForm.district.trim(),
      street: addressForm.street.trim(),
      postalCode: addressForm.postalCode.trim(),
      description: addressForm.description.trim(),
    }
    try {
      if (editingAddressId) await customersApi.updateAddress(customer.id, editingAddressId, { id: editingAddressId, ...body })
      else await customersApi.createAddress(customer.id, body)
      setAddresses(await customersApi.listAddresses(customer.id))
      setAddressForm(emptyAddress)
      setEditingAddressId(null)
      setSuccess(editingAddressId ? 'Adres güncellendi.' : 'Adres eklendi.')
    } catch (caught) {
      if (caught instanceof ApiError) {
        setAddressErrors(caught.fieldErrors)
        setError(caught.detail)
      } else setError('Adres kaydedilemedi.')
    } finally {
      setPendingAddress(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sky-950">Müşteriler</h1>
        <p className="mt-1 text-sm text-slate-600">Müşteri listeleme servisi yok. Kayıt oluşturulur veya kimlikle getirilir.</p>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Yeni müşteri">
          <form className="space-y-4" onSubmit={onCreateCustomer}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Ad" value={customerForm.firstName} error={customerErrors.firstName} onChange={(event) => setCustomerForm({ ...customerForm, firstName: event.target.value })} />
              <TextField label="Soyad" value={customerForm.lastName} error={customerErrors.lastName} onChange={(event) => setCustomerForm({ ...customerForm, lastName: event.target.value })} />
            </div>
            <TextField label="E-posta" type="email" value={customerForm.email} error={customerErrors.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} />
            <TextField label="Telefon" value={customerForm.phone} error={customerErrors.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} />
            <Button type="submit" pending={pendingCustomer}>Oluştur ve seç</Button>
          </form>
        </Panel>
        <Panel title="Kimlikle getir">
          <form className="space-y-4" onSubmit={onLookup}>
            <TextField label="Müşteri kimliği" value={lookupId} error={lookupError} onChange={(event) => setLookupId(event.target.value)} />
            <Button type="submit" pending={loading}>Getir</Button>
          </form>
          {loading ? <div className="mt-4"><Spinner /></div> : null}
          {customer ? (
            <div className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm text-sky-950">
              <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
              <p>{customer.email}</p>
              <p>{customer.phone || 'Telefon yok'}</p>
              <p className="mt-2 break-all text-xs text-slate-600">{customer.id}</p>
            </div>
          ) : <div className="mt-4"><EmptyState>Seçili müşteri yok.</EmptyState></div>}
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Panel title={editingAddressId ? 'Adresi düzenle' : 'Adres ekle'}>
          {customer ? (
            <form className="space-y-4" onSubmit={onSaveAddress}>
              <TextField label="Başlık" value={addressForm.title} error={addressErrors.title} onChange={(event) => setAddressForm({ ...addressForm, title: event.target.value })} />
              <TextField label="Ülke" value={addressForm.country} error={addressErrors.country} onChange={(event) => setAddressForm({ ...addressForm, country: event.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="İl" value={addressForm.city} error={addressErrors.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} />
                <TextField label="İlçe" value={addressForm.district} error={addressErrors.district} onChange={(event) => setAddressForm({ ...addressForm, district: event.target.value })} />
              </div>
              <TextField label="Sokak" value={addressForm.street} error={addressErrors.street} onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })} />
              <TextField label="Posta kodu" value={addressForm.postalCode} error={addressErrors.postalCode} onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })} />
              <TextAreaField label="Açıklama" value={addressForm.description} error={addressErrors.description} onChange={(event) => setAddressForm({ ...addressForm, description: event.target.value })} />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" pending={pendingAddress}>{editingAddressId ? 'Güncelle' : 'Adres ekle'}</Button>
                {editingAddressId ? <Button type="button" tone="secondary" onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); setAddressErrors({}) }}>Vazgeç</Button> : null}
              </div>
            </form>
          ) : <EmptyState>Adres eklemek için önce müşteri seçin.</EmptyState>}
        </Panel>
        <Panel title="Adresler">
          {!customer ? <EmptyState>Müşteri seçilmedi.</EmptyState> : null}
          {customer && addresses.length === 0 ? <EmptyState>Bu müşterinin adresi yok.</EmptyState> : null}
          {customer && addresses.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {addresses.map((address) => (
                <li key={address.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">{address.title}</p>
                    <p className="text-slate-600">{address.district}, {address.city} · {address.street}</p>
                    <p className="text-slate-500">{address.postalCode} · {address.description}</p>
                  </div>
                  <Button type="button" tone="secondary" onClick={() => { setEditingAddressId(address.id); setAddressForm({ title: address.title, country: address.country, city: address.city, district: address.district, street: address.street, postalCode: address.postalCode, description: address.description }); setAddressErrors({}) }}>
                    Düzenle
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </div>
    </div>
  )
}

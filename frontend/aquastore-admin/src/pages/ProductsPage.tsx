import { useEffect, useState, type FormEvent } from 'react'
import { brandsApi, categoriesApi, productsApi } from '../api/aquastore.ts'
import { ApiError } from '../api/client.ts'
import type { Brand, Category, Product } from '../api/types.ts'
import { Alert, Button, EmptyState, Panel, SelectField, Spinner, TextAreaField, TextField } from '../components/ui.tsx'
import { formatMoney } from '../format.ts'

const emptyForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '', brandId: '' }

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const [productList, brandList, categoryList] = await Promise.all([productsApi.list(), brandsApi.list(), categoriesApi.list()])
      setProducts(productList)
      setBrands(brandList)
      setCategories(categoryList)
      return productList
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.detail : 'Ürünler alınamadı.')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (form.name.trim() === '') next.name = 'Ürün adı boş olamaz.'
    else if (form.name.trim().length > 100) next.name = 'Ürün adı en fazla 100 karakter olabilir.'
    if (form.description.trim() === '') next.description = 'Açıklama boş olamaz.'
    else if (form.description.trim().length > 500) next.description = 'Açıklama en fazla 500 karakter olabilir.'
    const price = Number(form.price.replace(',', '.'))
    if (form.price.trim() === '' || Number.isNaN(price) || price < 0) next.price = 'Geçerli bir fiyat girin.'
    if (form.stock.trim() === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) next.stock = 'Stok sıfır veya pozitif bir tam sayı olmalıdır.'
    if (form.imageUrl.trim().length > 250) next.imageUrl = 'Görsel adresi en fazla 250 karakter olabilir.'
    if (!form.brandId) next.brandId = 'Marka seçin.'
    if (!form.categoryId) next.categoryId = 'Kategori seçin.'
    return next
  }

  function fill(product: Product) {
    setEditingId(product.id)
    setFieldErrors({})
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl ?? '',
      categoryId: product.categoryId,
      brandId: product.brandId,
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price.replace(',', '.')),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim(),
      categoryId: form.categoryId,
      brandId: form.brandId,
    }
    setPending(true)
    setError('')
    setSuccess('')
    try {
      if (editingId) await productsApi.update(editingId, { id: editingId, ...body })
      else await productsApi.create(body)
      setSuccess(editingId ? 'Ürün güncellendi.' : 'Ürün oluşturuldu.')
      setEditingId(null)
      setForm(emptyForm)
      await refresh()
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(caught.fieldErrors)
        setError(caught.detail)
        if (caught.status === 409) {
          const fresh = await refresh()
          const current = fresh.find((product) => product.id === editingId)
          if (current) fill(current)
        }
      } else {
        setError('Ürün kaydedilemedi.')
      }
    } finally {
      setPending(false)
    }
  }

  const brandName = (id: string) => brands.find((brand) => brand.id === id)?.name ?? 'Marka yok'
  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? 'Kategori yok'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sky-950">Ürünler</h1>
        <p className="mt-1 text-sm text-slate-600">Marka ve kategori listeden seçilir. Görsel için adres girilir.</p>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Panel title={editingId ? 'Ürünü düzenle' : 'Yeni ürün'}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <TextField label="Ürün adı" value={form.name} maxLength={100} error={fieldErrors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <TextAreaField label="Açıklama" value={form.description} maxLength={500} error={fieldErrors.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Fiyat" inputMode="decimal" value={form.price} error={fieldErrors.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
              <TextField label="Stok" inputMode="numeric" value={form.stock} error={fieldErrors.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
            </div>
            <TextField label="Görsel adresi" value={form.imageUrl} maxLength={250} error={fieldErrors.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
            <SelectField label="Marka" value={form.brandId} placeholder="Marka seçin" options={brands.map((brand) => ({ value: brand.id, label: brand.name }))} error={fieldErrors.brandId} onChange={(brandId) => setForm({ ...form, brandId })} />
            <SelectField label="Kategori" value={form.categoryId} placeholder="Kategori seçin" options={categories.map((category) => ({ value: category.id, label: category.name }))} error={fieldErrors.categoryId} onChange={(categoryId) => setForm({ ...form, categoryId })} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" pending={pending}>{editingId ? 'Güncelle' : 'Oluştur'}</Button>
              {editingId ? <Button type="button" tone="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); setFieldErrors({}) }}>Vazgeç</Button> : null}
            </div>
          </form>
        </Panel>
        <Panel title="Liste">
          {loading ? <Spinner /> : null}
          {!loading && products.length === 0 ? <EmptyState>Henüz ürün yok.</EmptyState> : null}
          {!loading && products.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {products.map((product) => (
                <li key={product.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600">{brandName(product.brandId)} · {categoryName(product.categoryId)}</p>
                    <p className="text-sm text-cyan-800">{formatMoney(product.price)} · Stok {product.stock}</p>
                  </div>
                  <Button type="button" tone="secondary" onClick={() => { fill(product); setSuccess(''); setError('') }}>Düzenle</Button>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </div>
    </div>
  )
}

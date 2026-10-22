import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '../api/client.ts'
import { Alert, Button, EmptyState, Panel, Spinner, TextAreaField, TextField } from '../components/ui.tsx'

type NamedRecord = { id: string; name: string; description: string | null }

type Props = {
  title: string
  intro: string
  nameLabel: string
  load: () => Promise<NamedRecord[]>
  create: (body: { name: string; description: string | null }) => Promise<NamedRecord>
  update: (id: string, body: { id: string; name: string; description: string | null }) => Promise<NamedRecord>
}

const emptyForm = { name: '', description: '' }

export function NameDescriptionPage({ title, intro, nameLabel, load, create, update }: Props) {
  const [items, setItems] = useState<NamedRecord[]>([])
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
      setItems(await load())
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.detail : 'Liste alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setEditingId(null)
    setForm(emptyForm)
    setSuccess('')
    setFieldErrors({})
    void refresh()
    // load kimliği sayfa değişince yenilenir; aynı bileşen örneği marka ve kategori arasında paylaşılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (form.name.trim() === '') next.name = `${nameLabel} boş olamaz.`
    else if (form.name.trim().length > 100) next.name = `${nameLabel} en fazla 100 karakter olabilir.`
    if (form.description.trim().length > 500) next.description = 'Açıklama en fazla 500 karakter olabilir.'
    return next
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    setError('')
    setSuccess('')
    const body = { name: form.name.trim(), description: form.description.trim() === '' ? null : form.description.trim() }
    try {
      if (editingId) await update(editingId, { id: editingId, ...body })
      else await create(body)
      setForm(emptyForm)
      setEditingId(null)
      setSuccess(editingId ? 'Kayıt güncellendi.' : 'Kayıt oluşturuldu.')
      await refresh()
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(caught.fieldErrors)
        setError(caught.detail)
      } else {
        setError('Kayıt tamamlanamadı.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-sky-950">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{intro}</p>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title={editingId ? 'Kaydı düzenle' : 'Yeni kayıt'}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <TextField label={nameLabel} value={form.name} maxLength={100} error={fieldErrors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <TextAreaField label="Açıklama" value={form.description} maxLength={500} error={fieldErrors.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" pending={pending}>{editingId ? 'Güncelle' : 'Oluştur'}</Button>
              {editingId ? (
                <Button type="button" tone="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); setFieldErrors({}) }}>
                  Vazgeç
                </Button>
              ) : null}
            </div>
          </form>
        </Panel>
        <Panel title="Liste">
          {loading ? <Spinner /> : null}
          {!loading && items.length === 0 ? <EmptyState>Henüz kayıt yok.</EmptyState> : null}
          {!loading && items.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.description || 'Açıklama yok'}</p>
                  </div>
                  <Button
                    type="button"
                    tone="secondary"
                    onClick={() => {
                      setEditingId(item.id)
                      setForm({ name: item.name, description: item.description ?? '' })
                      setFieldErrors({})
                      setSuccess('')
                      setError('')
                    }}
                  >
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

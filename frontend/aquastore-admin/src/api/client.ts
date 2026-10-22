export class ApiError extends Error {
  readonly status: number
  readonly detail: string
  readonly fieldErrors: Record<string, string>

  constructor(status: number, detail: string, fieldErrors: Record<string, string> = {}) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.fieldErrors = fieldErrors
  }
}

function apiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL
  if (!configured || configured.trim() === '') {
    throw new ApiError(0, 'VITE_API_BASE_URL tanımlı değil.')
  }
  return configured.replace(/\/$/, '')
}

function fieldKey(property: string): string {
  return property
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((part) => (part.length > 0 ? part.charAt(0).toLowerCase() + part.slice(1) : part))
    .join('.')
}

function readFieldErrors(body: unknown): Record<string, string> {
  if (!body || typeof body !== 'object' || !('errors' in body)) return {}
  const errors = (body as { errors?: unknown }).errors
  if (!errors || typeof errors !== 'object') return {}

  const fieldErrors: Record<string, string> = {}
  for (const [property, messages] of Object.entries(errors)) {
    if (!Array.isArray(messages)) continue
    const text = messages.filter((message) => typeof message === 'string').join(' ')
    if (text) fieldErrors[fieldKey(property)] = text
  }
  return fieldErrors
}

function readDetail(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback
  const record = body as { detail?: unknown; title?: unknown }
  if (typeof record.detail === 'string' && record.detail.trim() !== '') return record.detail
  if (typeof record.title === 'string' && record.title.trim() !== '') return record.title
  return fallback
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text.trim() === '') return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'API’ye ulaşılamadı. Sunucunun çalıştığını kontrol edin.')
  }

  const body = await parseBody(response)
  if (response.ok) return body as T

  const fieldErrors = readFieldErrors(body)
  const fallback = response.status === 404 ? 'Kayıt bulunamadı.' : 'İstek tamamlanamadı.'
  const detail = typeof body === 'string' && body.trim() !== '' ? body : readDetail(body, fallback)
  const summary = Object.values(fieldErrors)[0] ?? detail
  throw new ApiError(response.status, summary, fieldErrors)
}

import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

const fieldClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100'

export function TextField({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input className={fieldClass} {...props} />
      {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
    </label>
  )
}

export function TextAreaField({
  label,
  error,
  ...props
}: { label: string; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <textarea className={`${fieldClass} h-24 py-2`} {...props} />
      {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  error?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <Select.Root value={value === '' ? undefined : value} onValueChange={onChange} disabled={disabled || options.length === 0}>
        <Select.Trigger className={`${fieldClass} flex items-center justify-between text-left`}>
          <Select.Value placeholder={options.length === 0 ? 'Seçenek yok' : placeholder} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" position="popper" sideOffset={6}>
            <Select.Viewport className="max-h-72 p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-cyan-50"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="h-4 w-4 text-cyan-700" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
    </label>
  )
}

export function Button({
  children,
  pending = false,
  tone = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; tone?: 'primary' | 'secondary' }) {
  const tones = {
    primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
  }
  return (
    <button
      {...props}
      disabled={props.disabled || pending}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]} ${props.className ?? ''}`}
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  )
}

export function Alert({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  const tones = {
    error: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
  }
  return <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>{children}</div>
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-cyan-200 bg-white px-4 py-10 text-center text-sm text-slate-600">{children}</div>
}

export function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-cyan-800">
      <LoaderCircle className="h-4 w-4 animate-spin" />
      Yükleniyor
    </div>
  )
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

const money = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

export function formatMoney(value: number): string {
  return money.format(value)
}

export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('tr-TR')
}

export function isGuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim())
}

export const orderStatusLabels: Record<number, string> = {
  1: 'Beklemede',
  2: 'Hazırlanıyor',
  3: 'Kargoda',
  4: 'Tamamlandı',
  5: 'İptal',
}

export const invoiceTypeLabels: Record<number, string> = {
  0: 'Bireysel',
  1: 'Kurumsal',
}

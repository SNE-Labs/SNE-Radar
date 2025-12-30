import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

export function formatCurrency(value: any): string {
  const num = safeNumber(value, NaN)
  if (Number.isNaN(num)) return '-'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatPercentage(value: any): string {
  const num = safeNumber(value, NaN)
  if (Number.isNaN(num)) return '-%'
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
}

export function safeString(value: any, fallback: string = '-'): string {
  return value && typeof value === 'string' ? value : fallback
}

export function shortenAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}


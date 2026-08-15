import { CURRENCY_SYMBOLS, DEFAULT_CURRENCY, type Currency } from '@org/types';

export function formatCurrency(amount: number | string, currency: Currency = DEFAULT_CURRENCY): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${value.toFixed(2)}`;
}

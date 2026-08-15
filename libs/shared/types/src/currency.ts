export enum Currency {
  BDT = 'BDT',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.BDT]: '৳',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.INR]: '₹',
};

export const DEFAULT_CURRENCY = Currency.BDT;

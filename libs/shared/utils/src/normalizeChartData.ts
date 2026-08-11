import type { ChartPoint } from '@org/ui';

const LABEL_KEYS = ['label', 'date', 'name', 'period', 'day'];
const VALUE_KEYS = ['value', 'total', 'count', 'amount', 'revenue', 'sales'];

/**
 * Reports across modules don't share a fixed response shape (varies by
 * report/backend version), so this scans common key names instead of
 * assuming one schema.
 */
export function normalizeChartData(raw: unknown): ChartPoint[] {
  const rows = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).data)
      ? ((raw as Record<string, unknown>).data as unknown[])
      : [];

  return rows
    .filter((row): row is Record<string, unknown> => !!row && typeof row === 'object')
    .map((row) => {
      const labelKey = LABEL_KEYS.find((key) => row[key] !== undefined);
      const valueKey = VALUE_KEYS.find((key) => row[key] !== undefined);
      return {
        label: labelKey ? String(row[labelKey]) : '',
        value: valueKey ? Number(row[valueKey]) : 0,
      };
    });
}

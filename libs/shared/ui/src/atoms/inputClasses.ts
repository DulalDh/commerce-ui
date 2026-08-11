export function inputClasses(hasError?: boolean) {
  return [
    'w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors',
    'placeholder:text-neutral-400',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400',
    'dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600 dark:placeholder:text-neutral-500',
    hasError
      ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
      : 'border-neutral-300',
  ].join(' ');
}

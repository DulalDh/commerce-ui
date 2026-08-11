<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { providerCalendarService } from '@org/api-client';
import { useAuthStore } from '@org/auth';
import { Card, Button } from '@org/ui';

interface CalendarDay {
  date: string;
  bookings_count?: number;
  is_holiday?: boolean;
}

const auth = useAuthStore();
const tenantId = computed(() => auth.user?.tenant_id ?? '');

const cursor = ref(new Date());
const days = ref<CalendarDay[]>([]);
const loading = ref(true);

const monthLabel = computed(() =>
  cursor.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
);

const gridDays = computed(() => {
  const year = cursor.value.getFullYear();
  const month = cursor.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (CalendarDay | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    cells.push(days.value.find((day) => day.date === iso) ?? { date: iso });
  }
  return cells;
});

async function load() {
  if (!tenantId.value) return;
  loading.value = true;
  try {
    const year = cursor.value.getFullYear();
    const month = cursor.value.getMonth() + 1;
    const result = (await providerCalendarService.get(tenantId.value, { year, month })) as unknown as
      | CalendarDay[]
      | { days: CalendarDay[] };
    days.value = Array.isArray(result) ? result : (result.days ?? []);
  } finally {
    loading.value = false;
  }
}

function prevMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() - 1, 1);
  load();
}

function nextMonth() {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 1);
  load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ monthLabel }}</h3>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" @click="prevMonth">‹ Prev</Button>
          <Button size="sm" variant="secondary" @click="nextMonth">Next ›</Button>
        </div>
      </div>
    </template>

    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <div v-else class="grid grid-cols-7 gap-1 text-center text-xs">
      <div v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d" class="py-1 font-medium text-neutral-500">
        {{ d }}
      </div>
      <div
        v-for="(cell, i) in gridDays"
        :key="i"
        class="flex h-16 flex-col rounded-md border p-1 text-left"
        :class="
          cell
            ? cell.is_holiday
              ? 'border-danger-200 bg-danger-50 dark:border-danger-900 dark:bg-danger-900/20'
              : 'border-neutral-200 dark:border-neutral-700'
            : 'border-transparent'
        "
      >
        <span v-if="cell" class="text-neutral-500">{{ Number(cell.date.slice(-2)) }}</span>
        <span v-if="cell?.bookings_count" class="mt-auto text-[10px] font-medium text-primary-600">
          {{ cell.bookings_count }} bookings
        </span>
      </div>
    </div>
  </Card>
</template>

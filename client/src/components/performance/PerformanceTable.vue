<!-- components/performance/PerformanceTable.vue -->
<template>
  <div class="performance-table">
    <h2 class="table-title">{{ title }}</h2>
    <table>
      <tbody>
        <tr v-for="(item, index) in data" :key="`item-${index}`">
          <td>{{ item.label }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface TableItem {
  label: string;
  value: number;
}

defineProps<{
  title: string;
  data: TableItem[];
}>();
</script>

<style scoped>
.performance-table {
  margin-top: 1rem;
}

.table-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 0.5rem;
  border-bottom: 1px solid #eaeaea;
}
</style>

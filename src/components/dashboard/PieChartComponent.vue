<template>
  <div class="pie-chart">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface ChartData {
  name: string;
  value: number;
}

export default defineComponent({
  name: 'PieChartComponent',
  components: {
    Pie
  },
  props: {
    data: {
      type: Array as PropType<ChartData[]>,
      required: true
    }
  },
  setup(props) {
    const hasData = computed(() => props.data.some((entry: ChartData) => entry.value > 0));

    const chartData = computed(() => ({
      labels: props.data.map((d: ChartData) => d.name),
      datasets: [
        {
          data: props.data.map((d: ChartData) => d.value),
          backgroundColor: hasData.value ? ['#38A169', '#E53E3E'] : ['#bbbbbb'],
          hoverOffset: 4
        }
      ]
    }));

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: hasData.value
        }
      }
    }));

    return {
      chartData,
      chartOptions
    };
  }
});
</script>

<style scoped>
.pie-chart {
  width: 100%;
  height: 400px;
}
</style>

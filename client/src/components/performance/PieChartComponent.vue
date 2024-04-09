<template>
  <div class="pie-chart-container">
    <Pie :data="chartData" :options="computedOptions" />
    <slot :data="chartData"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export default defineComponent({
  name: 'PieChartComponent',
  components: {
    Pie
  },
  props: {
    labels: Array as PropType<string[]>,
    data: Array as PropType<number[]>,
    backgroundColors: Array as PropType<string[]>,
    options: Object as PropType<Object>
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.labels,
      datasets: [
        {
          data: props.data || [],
          backgroundColor: props.backgroundColors,
          hoverOffset: 4
        }
      ]
    }));

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      cutout: '80%'
    };

    const computedOptions = computed(() => ({
      ...defaultOptions,
      ...props.options
    }));

    return {
      chartData,
      computedOptions
    };
  }
});
</script>

<style scoped>
.pie-chart-container {
  position: relative;
  max-width: 80%;
}
</style>

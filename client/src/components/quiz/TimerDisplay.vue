<template>
  <div>{{ formattedTime }}</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const mode = computed(() => store.getters.mode);
const timer = computed(() => store.getters.timer);
const showingExplanation = computed(() => store.state.showingExplanation);

const formattedTime = computed(() => {
  const minutes = Math.floor(timer.value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timer.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

let intervalId = null;

const updateTimer = () => {
  if (mode.value === 'tutor' && !showingExplanation.value) {
    store.commit('INCREMENT_TIMER');
  } else if (mode.value === 'timed') {
    store.commit('DECREMENT_TIMER');
  }
};

onMounted(() => {
  intervalId = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

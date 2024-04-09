<!-- views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h1 class="text-center text-xl">AWS World</h1>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <QuizOptions />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuizOptions from '@/components/quiz/QuizOptions.vue';
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--surface-ground);
  padding: 2rem;
}

.card {
  background-color: var(--surface-card);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
}
</style>

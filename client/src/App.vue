<!-- App.vue -->
<template>
  <div class="app-container">
    <div v-if="!isQuizRoute" class="sidebar">
      <div class="sidebar-header">
        <h2>AWorld</h2>
      </div>
      <div class="sidebar-content">
        <ul class="nav-menu">
          <li v-for="(item, index) in menuItems" :key="index">
            <router-link :to="item.to">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-content">
      <!-- Show Navbar only on quiz routes -->
      <Navbar v-if="isQuizRoute" />

      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/common/NavbarComponent.vue';

const route = useRoute();

const menuItems = [
  { label: 'Create Test', to: '/', icon: 'pi pi-pencil' },
  { label: 'Previous Tests', to: '/history', icon: 'pi pi-history' },
  { label: 'Performance', to: '/performance', icon: 'pi pi-chart-bar' }
];

const isQuizRoute = computed(() => route.path.startsWith('/quiz'));
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: var(--surface-ground);
  color: var(--text-color);
  border-right: 1px solid var(--surface-border);
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-content {
  padding: 1rem;
}

.nav-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin-bottom: 0.5rem;
}

.nav-menu a {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-color);
  transition: background-color 0.3s;
}

.nav-menu a:hover {
  background-color: var(--surface-hover);
}

.nav-menu a i {
  margin-right: 0.5rem;
}

.main-content {
  flex: 1;
  padding: 0rem;
}
</style>

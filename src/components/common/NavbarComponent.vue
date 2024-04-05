<template>
  <Menubar class="navbar">
    <template #start>
      <router-link v-if="$route.path !== '/'" to="/" class="p-menuitem-link">
        Back to Dashboard
      </router-link>
      <div v-else class="p-menuitem-text">AWS World</div>
    </template>
  </Menubar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menubar from 'primevue/menubar';

export default defineComponent({
  name: 'NavbarComponent',
  components: {
    Menubar,
  },
});
</script>

<style scoped>
.navbar {
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.p-menuitem-link:hover {
  text-decoration: none;
  color: #bee3f8;
}
</style>

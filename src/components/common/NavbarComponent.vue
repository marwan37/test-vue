<template>
  <Menubar class="navbar">
    <template #start>
      <router-link v-if="$route.path !== '/'" to="/" class="p-menuitem-link">
        Back to Dashboard
      </router-link>
      <div v-else class="p-menuitem-text">AWS World</div>
    </template>
    <template #end>
      <select @change="event => switchTheme((event.target as HTMLSelectElement)?.value)">
        <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
      </select>
    </template>
  </Menubar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Menubar from 'primevue/menubar';
import { usePrimeVue } from 'primevue/config';

export default defineComponent({
  name: 'NavbarComponent',
  components: {
    Menubar
  },
  setup() {
    const PrimeVue = usePrimeVue();
    const currentTheme = ref('aura-light-green');
    const themes = ref([
      'md-light-indigo',
      'md-light-deeppurple',
      'md-dark-indigo',
      'md-dark-deeppurple',
      'mdc-light-indigo',
      'mdc-light-deeppurple',
      'mdc-dark-indigo',
      'mdc-dark-deeppurple',
      'aura-light-blue',
      'aura-light-indigo',
      'aura-light-purple',
      'aura-light-teal',
      'aura-light-green',
      'aura-light-amber',
      'aura-light-cyan',
      'aura-light-pink',
      'aura-light-lime',
      'aura-light-noir',
      'aura-dark-blue',
      'aura-dark-indigo',
      'aura-dark-purple',
      'aura-dark-teal',
      'aura-dark-green',
      'aura-dark-amber',
      'aura-dark-cyan',
      'aura-dark-pink',
      'aura-dark-lime',
      'aura-dark-noir',
      'lara-light-blue',
      'lara-light-indigo',
      'lara-light-purple',
      'lara-light-teal',
      'lara-light-green',
      'lara-light-amber',
      'lara-light-cyan',
      'lara-light-pink',
      'lara-dark-blue',
      'lara-dark-indigo',
      'lara-dark-purple',
      'lara-dark-teal',
      'lara-dark-green',
      'lara-dark-amber',
      'lara-dark-cyan',
      'lara-dark-pink'
    ]);

    function switchTheme(newTheme: string) {
      const oldTheme = currentTheme.value;
      currentTheme.value = newTheme;
      PrimeVue.changeTheme(oldTheme, newTheme, 'theme-link', () => {
        console.log(`Theme switched to ${newTheme}`);
      });
    }

    return { currentTheme, themes, switchTheme };
  }
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

<template>
  <Menubar>
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

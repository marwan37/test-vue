<template>
  <Menubar class="navbar">
    <template #start>
      <a
        v-if="$route.path !== '/'"
        @click="confirmNavigation"
        class="p-menuitem-link cursor-pointer">
        Back to Dashboard
      </a>
      <div v-else class="p-menuitem-text">AWS World</div>
    </template>
    <template #end>
      <div class="flex space-x-4">
        <select @change="event => switchTheme((event.target as HTMLSelectElement)?.value)">
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
      </div>
    </template>
    <TimerDisplay v-if="isQuizActive" />
  </Menubar>
  <ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import ConfirmDialog from 'primevue/confirmdialog';
import { usePrimeVue } from 'primevue/config';
import { useConfirm } from 'primevue/useconfirm';
import TimerDisplay from '@/components/quiz/TimerDisplay.vue';

export default defineComponent({
  name: 'NavbarComponent',
  components: {
    Menubar,
    ConfirmDialog,
    TimerDisplay
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const PrimeVue = usePrimeVue();
    const confirm = useConfirm();

    const currentTheme = ref('aura-light-amber');
    const themes = ref(['aura-dark-amber', 'aura-light-amber', 'fluent-light', 'tailwind-light']);

    const isQuizActive = computed(() => {
      return (
        route.path.startsWith('/quiz') &&
        !store.getters.isQuizFinished &&
        !store.getters.isQuizSuspended
      );
    });

    function switchTheme(newTheme: string) {
      const oldTheme = currentTheme.value;
      currentTheme.value = newTheme;
      PrimeVue.changeTheme(oldTheme, newTheme, 'theme-link', () => {
        console.log(`Theme switched to ${newTheme}`);
      });
    }

    function confirmNavigation(event: Event) {
      if (isQuizActive.value) {
        event.preventDefault();
        confirm.require({
          message: 'Are you sure you want to suspend the current test?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            store.commit('SET_QUIZ_SUSPENDED', true);
            router.push('/');
          }
        });
      } else {
        router.push('/');
      }
    }

    return { currentTheme, themes, switchTheme, isQuizActive, confirmNavigation };
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
.p-menuitem-link {
  text-decoration: none;
  color: white;
}

.p-menuitem-link:hover {
  text-decoration: none;
  color: #bee3f8;
}
</style>

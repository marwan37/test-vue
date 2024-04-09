// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/Quiz.vue'),
    },
    // Add this route for handling individual quiz IDs
    {
      path: '/quiz/:quizId',
      name: 'quizDetail',
      component: () => import('../views/Quiz.vue'),
      props: true
    },
    {
      path: '/history',
      name: 'previousTests',
      component: () => import('../views/PreviousTests.vue')
    },
    {
      path: '/quiz-result',
      name: 'QuizResult',
      component: () => import('../views/QuizResult.vue'),
      beforeEnter: (to, from, next) => {
        const latestQuizResult = store.getters.latestQuizResult;
        if (latestQuizResult) {
          next();
        } else {
          console.log("No quiz result available. Redirecting to home.");
          next({ name: 'home' }); // Redirect home otherwise
        }
      }
    },
    {
      path: '/performance',
      name: 'performance',
      component: () => import('../views/Performance.vue')
    }
  ]
})

export default router;

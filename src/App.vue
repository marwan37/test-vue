<!-- App.vue -->
<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/common/NavbarComponent.vue';
</script>

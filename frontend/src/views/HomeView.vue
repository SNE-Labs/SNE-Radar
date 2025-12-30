<template>
  <div class="home">
    <h1>SNE Radar</h1>
    <p>Sistema de análise técnica avançada</p>
    <router-link to="/dashboard">Acessar Dashboard</router-link>
  </div>
</template>

<script setup lang="ts">
// Home view
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}
</style>


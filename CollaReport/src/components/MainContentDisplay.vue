<script setup lang="ts">
const props = defineProps<{
  selectedMenuItem: string | null;
}>();
</script>

<template>
  <div class="main-content-display">
    <h1 v-if="selectedMenuItem">
      {{ selectedMenuItem }}
    </h1>
    <h1 v-else></h1>
  </div>
</template>

<style scoped>
.main-content-display {
  padding: 2rem;
  text-align: center;
}
</style>

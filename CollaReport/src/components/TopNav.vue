<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['select-category']);

const categories = ref([
  { name: 'Home', id: 'Id_Home' },
  { name: 'Report', id: 'Id_Report' },
  { name: 'Setting', id: 'Id_Setting' },
]);

const selectCategory = (categoryId: string) => {
  emit('select-category', categoryId);
};
</script>

<template>
  <nav class="top-nav">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.id)"
      class="top-nav-item"
    >
      {{ category.name }}
    </button>
  </nav>
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: flex-start; /* Align left */
  align-items: center;
  padding: 0 1rem;
  background-color: #0052CC; /* JIRA Blue */
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.top-nav-item {
  background: none;
  border: none;
  color: white;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.top-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
